import React, { useState, useEffect } from 'react';
import { X, Cpu, Settings, Key, Globe, Sparkles, Check, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { CustomLLMConfig } from '../types';
import { getCustomLLMConfig, saveCustomLLMConfig, DEFAULT_LLM_CONFIG } from '../services/storage';
import { fetchCustomLLMChat } from '../services/api';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<CustomLLMConfig>(DEFAULT_LLM_CONFIG);
  const [activeTab, setActiveTab] = useState<'llm' | 'buscadores'>('llm');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getCustomLLMConfig());
      setTestStatus('idle');
      setTestMessage('');
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: CustomLLMConfig['provider']) => {
    let defaultUrl = '';
    let defaultModel = config.modelName;

    if (provider === 'gemini-default') {
      defaultUrl = '';
      defaultModel = 'gemini-2.5-flash';
    } else if (provider === 'openrouter') {
      defaultUrl = 'https://openrouter.ai/api/v1/chat/completions';
      defaultModel = 'deepseek/deepseek-r1:free';
    } else if (provider === 'groq') {
      defaultUrl = 'https://api.groq.com/openai/v1/chat/completions';
      defaultModel = 'llama-3.3-70b-versatile';
    } else if (provider === 'ollama') {
      defaultUrl = 'http://localhost:11434/api/generate';
      defaultModel = 'llama3:latest';
    }

    setConfig(prev => ({
      ...prev,
      provider,
      endpointUrl: defaultUrl,
      modelName: defaultModel,
      enabled: provider !== 'gemini-default',
    }));
  };

  const handleSave = () => {
    saveCustomLLMConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Testando conexão e latência com o modelo escolhido...');
    try {
      const res = await fetchCustomLLMChat(
        config,
        'Responda em uma única frase curta: Qual a relevância histórica de Pedreira/SP como a Capital da Porcelana?'
      );
      setTestStatus('success');
      setTestMessage(`Conexão BEM-SUCEDIDA! Resposta: "${res.text}"`);
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Erro na conexão: ${err.message || 'Verifique sua URL, API Key ou Nome do Modelo.'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[4500] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#0a0a0b]/85 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div 
        className="relative w-full max-w-2xl bg-[#0f0f10] border-t md:border border-white/10 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[88vh] mt-auto md:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle para Mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2.5 md:hidden shrink-0" />

        {/* Cabeçalho */}
        <div className="p-6 bg-[#1a1a1c] border-b border-white/10 flex items-start justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0 shadow-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#f5f2ed] tracking-tight font-serif">
                Configurações de IA & Buscadores
              </h2>
              <p className="text-xs text-[#dcdcdc]/60">
                Personalize endpoints livres, modelos (DeepSeek, Llama, Groq, Ollama) e busca secundária
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#dcdcdc]/60 hover:text-[#f5f2ed] border border-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Fechar Configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-white/10 bg-[#0a0a0b]/60 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('llm')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all min-h-[44px] ${
              activeTab === 'llm'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>LLMs Personalizadas & Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('buscadores')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all min-h-[44px] ${
              activeTab === 'buscadores'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Buscadores Secundários (DuckDuckGo / Wiki)</span>
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {activeTab === 'llm' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Seletor Rápido de Provedor */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#dcdcdc]/80 mb-3">
                  Escolha o Provedor ou Endpoint Livre:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProviderChange('gemini-default')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[54px] flex flex-col justify-center ${
                      config.provider === 'gemini-default'
                        ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#f5f2ed]'
                        : 'bg-[#1a1a1c]/60 border-white/10 text-[#dcdcdc]/70 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs">✨ Gemini Oficial</span>
                    <span className="text-[10px] opacity-70">gemini-3.5-flash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange('openrouter')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[54px] flex flex-col justify-center ${
                      config.provider === 'openrouter'
                        ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#f5f2ed]'
                        : 'bg-[#1a1a1c]/60 border-white/10 text-[#dcdcdc]/70 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs">🌐 OpenRouter</span>
                    <span className="text-[10px] opacity-70">Modelos Free / R1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange('groq')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[54px] flex flex-col justify-center ${
                      config.provider === 'groq'
                        ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#f5f2ed]'
                        : 'bg-[#1a1a1c]/60 border-white/10 text-[#dcdcdc]/70 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs">⚡ Groq API</span>
                    <span className="text-[10px] opacity-70">Llama 3.3 70B (Veloz)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange('ollama')}
                    className={`p-3 rounded-xl border text-left transition-all min-h-[54px] flex flex-col justify-center ${
                      config.provider === 'ollama'
                        ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#f5f2ed]'
                        : 'bg-[#1a1a1c]/60 border-white/10 text-[#dcdcdc]/70 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs">🦙 Ollama Local</span>
                    <span className="text-[10px] opacity-70">http://localhost:11434</span>
                  </button>
                </div>
              </div>

              {/* Toggle Habilitar LLM Personalizada */}
              <div className="flex items-center justify-between p-4 bg-[#1a1a1c] border border-white/10 rounded-xl">
                <div>
                  <span className="font-semibold text-xs text-[#f5f2ed]">Ativar Endpoint Customizado</span>
                  <p className="text-[11px] text-[#dcdcdc]/60 mt-0.5">
                    Quando desativado, o aplicativo utiliza o Gemini Oficial de alta precisão nativo do servidor
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-end">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#0a0a0b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c5a059]"></div>
                </label>
              </div>

              {/* Campos de Configuração */}
              {config.provider !== 'gemini-default' && (
                <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-[#dcdcdc] mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>URL do Endpoint (API Base URL / Chat Completions):</span>
                    </label>
                    <input
                      type="text"
                      value={config.endpointUrl}
                      onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
                      placeholder="Ex: https://openrouter.ai/api/v1/chat/completions ou http://localhost:11434/api/generate"
                      className="w-full bg-[#0a0a0b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none font-mono min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#dcdcdc] mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>API Key (Opcional para Ollama local ou endpoints livres):</span>
                    </label>
                    <input
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      placeholder="Sua chave de API (sk-... ou openrouter-...)"
                      className="w-full bg-[#0a0a0b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none font-mono min-h-[44px]"
                    />
                    <span className="text-[10px] text-[#dcdcdc]/50 mt-1 block">
                      🔒 Salvo apenas no seu navegador (localStorage). Nunca é gravado em registros remotos.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#dcdcdc] mb-1.5 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Nome do Modelo (Model Name):</span>
                      </label>
                      <input
                        type="text"
                        value={config.modelName}
                        onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                        placeholder="Ex: deepseek/deepseek-r1:free, llama-3.3-70b-versatile"
                        className="w-full bg-[#0a0a0b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none font-mono min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#dcdcdc] mb-1.5 flex items-center justify-between">
                        <span>Criatividade (Temperature): {config.temperature}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                        className="w-full accent-[#c5a059] bg-[#0a0a0b] h-2 rounded-lg cursor-pointer mt-3"
                      />
                      <div className="flex justify-between text-[10px] text-[#dcdcdc]/50 mt-1">
                        <span>0.0 (Factual/Preciso)</span>
                        <span>1.0 (Criativo)</span>
                      </div>
                    </div>
                  </div>

                  {/* Botão Testar Conexão */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing' || !config.endpointUrl}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#1a1a1c] hover:bg-[#252528] border border-white/15 rounded-xl text-xs font-semibold text-[#f5f2ed] flex items-center justify-center gap-2 transition-all min-h-[44px] disabled:opacity-50 cursor-pointer"
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#c5a059]" />
                          <span>Testando conexão...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#c5a059]" />
                          <span>Testar Conexão e Modelo</span>
                        </>
                      )}
                    </button>

                    {testMessage && (
                      <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        testStatus === 'success'
                          ? 'bg-[#58b38a]/15 border-[#58b38a]/30 text-[#58b38a]'
                          : testStatus === 'error'
                          ? 'bg-[#e76f51]/15 border-[#e76f51]/30 text-[#e76f51]'
                          : 'bg-white/5 border-white/10 text-[#dcdcdc]'
                      }`}>
                        {testStatus === 'success' ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                        <span>{testMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'buscadores' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#1a1a1c] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs">
                  <Globe className="w-4 h-4" />
                  <span>Buscadores Secundários Integrados no Servidor</span>
                </div>
                <p className="text-xs text-[#dcdcdc]/80 leading-relaxed">
                  Além do Google Search & Maps Grounding oficial do Gemini, o aplicativo agora implementa rotas de servidor para consulta instantânea na <strong>Wikipédia em Português</strong> e no <strong>DuckDuckGo Instant Answers</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#0a0a0b] rounded-lg border border-white/10">
                    <span className="font-bold text-xs text-[#f5f2ed] block mb-1">📖 Wikipédia (Action API)</span>
                    <span className="text-[11px] text-[#dcdcdc]/60">Resumos biográficos, contexto de batalhas da FEB, monarcas e pioneiros paulistas sem rastreamento.</span>
                  </div>
                  <div className="p-3 bg-[#0a0a0b] rounded-lg border border-white/10">
                    <span className="font-bold text-xs text-[#f5f2ed] block mb-1">🦆 DuckDuckGo Instant</span>
                    <span className="text-[11px] text-[#dcdcdc]/60">Resumos em tempo real, tópicos relacionados e citações externas direto da web aberta.</span>
                  </div>
                </div>
              </div>

              {/* Checkbox para usar Busca Secundária como Contexto da LLM */}
              <div className="p-4 bg-[#1a1a1c]/80 border border-[#c5a059]/30 rounded-xl space-y-2">
                <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={config.useSecondarySearchAsContext}
                    onChange={(e) => setConfig({ ...config, useSecondarySearchAsContext: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-[#0a0a0b] text-[#c5a059] focus:ring-[#c5a059]"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#f5f2ed] block">
                      Enriquecer LLMs personalizadas com resumos da Wikipédia & DuckDuckGo (Grounding Híbrido)
                    </span>
                    <span className="text-[11px] text-[#dcdcdc]/70 mt-0.5 block leading-relaxed">
                      Ao consultar modelos livres (como DeepSeek R1 ou Llama 3.3), o sistema busca automaticamente a biografia do homenageado no buscador secundário e injeta como contexto factual para evitar alucinações.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="p-6 bg-[#1a1a1c] border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs text-[#dcdcdc]/60">
            {isSaved ? (
              <span className="text-[#58b38a] font-semibold flex items-center gap-1 animate-fadeIn">
                <Check className="w-4 h-4" />
                Configurações gravadas no navegador!
              </span>
            ) : (
              <span>Arquitetura Híbrida • UI/UX Pro Max</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/10 text-xs font-semibold text-[#dcdcdc] transition-colors min-h-[44px] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#c5a059] hover:bg-[#b08d48] text-black font-bold text-xs shadow-lg transition-all min-h-[44px] flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
