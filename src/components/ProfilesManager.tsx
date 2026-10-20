import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, Lock, Download, Upload, Plus, Check, Key, RefreshCw, X, User } from 'lucide-react';
import { encryptAppData, decryptAppData, downloadEncryptedVault, EncryptedVaultPayload } from '../utils/cryptoSync';

interface ProfilesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: UserProfile) => void;
  onImportVaultData: (profiles: UserProfile[]) => void;
}

export const ProfilesManager: React.FC<ProfilesManagerProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onImportVaultData,
}) => {
  const [passphrase, setPassphrase] = useState<string>('QiVitality2026!');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New profile form state
  const [newName, setNewName] = useState<string>('');
  const [newFocus, setNewFocus] = useState<UserProfile['targetFocus']>('cervical');
  const [newGoal, setNewGoal] = useState<string>('');

  if (!isOpen) return null;

  const handleExportVault = async () => {
    setIsExporting(true);
    setStatusMsg(null);
    try {
      const payload = await encryptAppData({ profiles }, passphrase);
      downloadEncryptedVault(payload, `qiposture_vault_${Date.now()}.json`);
      setStatusMsg('Bóveda encriptada con AES-256-GCM descargada exitosamente.');
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Error al encriptar la bóveda.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawJson = JSON.parse(event.target?.result as string);
        const decrypted = await decryptAppData(rawJson, passphrase);
        if (decrypted?.profiles && Array.isArray(decrypted.profiles)) {
          onImportVaultData(decrypted.profiles);
          setStatusMsg(`Se importaron y desencriptaron ${decrypted.profiles.length} perfiles.`);
        } else {
          setStatusMsg('El formato de la bóveda no es válido.');
        }
      } catch (err: any) {
        setStatusMsg('Error al desencriptar: contraseña incorrecta o archivo corrupto.');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProfile: UserProfile = {
      id: `prof-${Date.now()}`,
      name: newName.trim(),
      avatarSeed: `seed-${Date.now()}`,
      targetFocus: newFocus,
      customGoals: newGoal.trim() ? [newGoal.trim()] : ['Alineación y fluidez de Jin Ye'],
      postureBaselineScore: 75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProfile(newProfile);
    setShowAddForm(false);
    setNewName('');
    setNewGoal('');
    setStatusMsg(`Perfil "${newProfile.name}" creado y sincronizado.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#14181f] border border-[#252b36] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#252b36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0e2e24] border border-[#34d399]/40 flex items-center justify-center text-[#34d399]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#f3f4f6]">
                Perfiles & Bóveda Encriptada en la Nube
              </h2>
              <p className="text-xs text-[#8b94a3]">
                Almacenamiento seguro cliente-servidor con cifrado AES-256-GCM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#98a2b3] hover:text-[#f3f4f6] hover:bg-[#1c222c] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* Status notification */}
          {statusMsg && (
            <div className="p-3 rounded-lg bg-[#0e2e24] border border-[#34d399]/30 text-xs text-[#d8f3dc]">
              {statusMsg}
            </div>
          )}

          {/* Profile Switcher List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#f3f4f6]">
                Perfiles Sincronizados ({profiles.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-medium text-[#c49b66] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancelar' : 'Añadir Perfil'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProfile(p.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#1c222c] border-[#c49b66]'
                        : 'bg-[#161a21] border-[#252b36] hover:border-[#3a4250]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1c222c] border border-[#2e3746] flex items-center justify-center text-xs font-bold text-[#c49b66]">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#f3f4f6] flex items-center gap-2">
                          <span>{p.name}</span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0e2e24] text-[#34d399]">
                              Activo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8b94a3] capitalize">
                          Enfoque: {p.targetFocus.replace('_', ' ')} · Base: {p.postureBaselineScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono-num text-[#34d399] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Cifrado
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Profile Form */}
          {showAddForm && (
            <form onSubmit={handleCreateProfile} className="p-4 rounded-xl bg-[#161a21] border border-[#252b36] space-y-3">
              <h3 className="text-xs font-semibold text-[#f3f4f6]">Crear Nuevo Perfil</h3>
              <div>
                <label className="block text-[11px] text-[#8b94a3] mb-1">Nombre o Alias:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Roberto - Postura Lumbar"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1116] border border-[#2e3746] text-xs text-[#f3f4f6] focus:outline-none focus:border-[#c49b66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8b94a3] mb-1">Enfoque de Alineación Principal:</label>
                <select
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1116] border border-[#2e3746] text-xs text-[#f3f4f6] focus:outline-none focus:border-[#c49b66]"
                >
                  <option value="cervical">Cervical (Cabeza adelantada y trapecios)</option>
                  <option value="hipercifosis">Hipercifosis (Dorsal curva y hombros cerrados)</option>
                  <option value="lumbar">Lumbar (Lordosis, rigidez y pélvica)</option>
                  <option value="vitalidad_liquidos">Vitalidad de Líquidos Jin Ye (Circulación y Linfa)</option>
                  <option value="equilibrio_general">Equilibrio General Wu Ji</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#8b94a3] mb-1">Objetivo Personalizado:</label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Ej. Aliviar pinzamiento cervical de oficina"
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1116] border border-[#2e3746] text-xs text-[#f3f4f6] focus:outline-none focus:border-[#c49b66]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#98a2b3] hover:text-[#f3f4f6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] text-xs font-semibold"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          )}

          {/* Cloud Vault Encryption Controls */}
          <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f3f4f6]">
              <Key className="w-3.5 h-3.5 text-[#c49b66]" />
              <span>Contraseña Maestra de Cifrado (Zero-Knowledge)</span>
            </div>
            
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0e1116] border border-[#2e3746] text-xs text-[#f3f4f6] font-mono-num focus:outline-none focus:border-[#c49b66]"
              placeholder="Contraseña de la bóveda"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleExportVault}
                disabled={isExporting}
                className="flex-1 py-2 px-3 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-xs font-medium text-[#e7eaef] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#34d399]" />
                <span>Exportar Bóveda Encriptada</span>
              </button>

              <label className="flex-1 py-2 px-3 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-xs font-medium text-[#e7eaef] flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#6f97ff]" />
                <span>Importar Bóveda (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
