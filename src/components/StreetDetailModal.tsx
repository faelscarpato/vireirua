import React, { useState, useEffect } from 'react';
import { RuaComMeta, LembrancaFamilia, GroundingResponse, CityConfig, WikipediaResult, DuckDuckGoResult, CustomLLMConfig } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { getLembrancasPorRua, adicionarLembranca, curtirLembranca, getCustomLLMConfig } from '../services/storage';
import { fetchSearchGrounding, fetchMapsGrounding, fetchWikipediaSearch, fetchDuckDuckGoSearch, fetchCustomLLMChat } from '../services/api';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { 
  X, ExternalLink, MessageSquarePlus, Heart, Search, MapPin, 
  Sparkles, Clock, User, Award, BookOpen, AlertCircle, CheckCircle2,
  Loader2, Share2, Globe, Cpu, RefreshCw, Send
} from 'lucide-react';

interface StreetDetailModalProps {
  rua: RuaComMeta | null;
  onClose: () => void;
  currentCity?: CityConfig;
}

export const StreetDetailModal: React.FC<StreetDetailModalProps> = ({
  rua,
  onClose,
  currentCity
}) => {
  const cityName = currentCity ? currentCity.nome : 'Pedreira';
  const cityState = currentCity ? currentCity.estado : 'SP';
  const [lembrancas, setLembrancas] = useState<LembrancaFamilia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [autor, setAutor] = useState('');
  const [relacao, setRelacao] = useState('Morador antigo');
  const [periodo, setPeriodo] = useState('Anos 1980');
  const [relato, setRelato] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Estados de IA Grounding (@[Use Google Search data] & @[Use Google Maps data])
  const [activeTab, setActiveTab] = useState<'historia' | 'lembrancas' | 'ia_grounding' | 'buscadores' | 'llm_custom'>('historia');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [searchGroundingResult, setSearchGroundingResult] = useState<GroundingResponse | null>(null);
  const [mapsGroundingResult, setMapsGroundingResult] = useState<GroundingResponse | null>(null);
  const [aiMode, setAiMode] = useState<'search' | 'maps'>('search');

  // Estados de Buscadores Secundários (Wikipedia & DuckDuckGo)
  const [wikiResult, setWikiResult] = useState<WikipediaResult | null>(null);
  const [ddgResult, setDdgResult] = useState<DuckDuckGoResult | null>(null);
  const [secLoading, setSecLoading] = useState(false);
  const [secError, setSecError] = useState('');
  const [secMode, setSecMode] = useState<'wiki' | 'ddg'>('wiki');

  // Estados de LLM Customizada
  const [customLlmConfig, setCustomLlmConfig] = useState<CustomLLMConfig>(getCustomLLMConfig());
  const [customLlmPrompt, setCustomLlmPrompt] = useState('');
  const [customLlmResult, setCustomLlmResult] = useState<string | null>(null);
  const [customLlmLoading, setCustomLlmLoading] = useState(false);
  const [customLlmError, setCustomLlmError] = useState('');

  useEffect(() => {
    if (rua) {
      setLembrancas(getLembrancasPorRua(rua.nome));
      setShowForm(false);
      setFormError('');
      setFormSuccess(false);
      setActiveTab('historia');
      setSearchGroundingResult(null);
      setMapsGroundingResult(null);
      setAiError('');
      setWikiResult(null);
      setDdgResult(null);
      setSecError('');
      setCustomLlmResult(null);
      setCustomLlmError('');
      setCustomLlmConfig(getCustomLLMConfig());
      setCustomLlmPrompt(`Como podemos valorizar a memória cívica e o batismo de "${rua.nome}" (${rua.homenageado}) na comunidade atual de ${cityName}?`);
    }
  }, [rua, cityName]);

  if (!rua) return null;

  const infoEixo = EIXOS_INFO[rua.eixo];

  // Enviar relato oral (salvo no localStorage)
  const handleSubmitRelato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !relato.trim()) {
      setFormError('Por favor, preencha seu nome e o seu relato de família.');
      return;
    }

    const nova = adicionarLembranca({
      ruaNome: rua.nome,
      autor: autor.trim(),
      relacao: relacao.trim(),
      relato: relato.trim(),
      periodo: periodo.trim()
    });

    setLembrancas([nova, ...lembrancas]);
    setAutor('');
    setRelato('');
    setFormError('');
    setFormSuccess(true);
    setShowForm(false);

    // Celebração de confete
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => setFormSuccess(false), 4000);
  };

  const handleCurtir = (id: string) => {
    curtirLembranca(id);
    setLembrancas(getLembrancasPorRua(rua.nome));
  };

  // Disparar Enriquecimento IA com Google Search
  const handleRunSearchGrounding = async () => {
    setAiMode('search');
    setActiveTab('ia_grounding');
    if (searchGroundingResult) return;

    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetchSearchGrounding(rua.nome, rua.homenageado, rua.resumo);
      setSearchGroundingResult(res);
    } catch (err: any) {
      setAiError(err.message || 'Erro na consulta de inteligência artificial.');
    } finally {
      setAiLoading(false);
    }
  };

  // Disparar Enriquecimento IA com Google Maps
  const handleRunMapsGrounding = async () => {
    setAiMode('maps');
    setActiveTab('ia_grounding');
    if (mapsGroundingResult) return;

    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetchMapsGrounding(rua.nome, rua.lat, rua.lng, rua.bairroEstetico);
      setMapsGroundingResult(res);
    } catch (err: any) {
      setAiError(err.message || 'Erro na consulta do Google Maps.');
    } finally {
      setAiLoading(false);
    }
  };

  // Disparar Buscador Secundário (Wikipedia ou DuckDuckGo)
  const handleRunSecondarySearch = async (mode: 'wiki' | 'ddg') => {
    setSecMode(mode);
    setActiveTab('buscadores');
    if (mode === 'wiki' && wikiResult) return;
    if (mode === 'ddg' && ddgResult) return;

    setSecLoading(true);
    setSecError('');
    try {
      const termoBusca = rua.homenageado || rua.nome;
      if (mode === 'wiki') {
        const res = await fetchWikipediaSearch(termoBusca);
        setWikiResult(res);
      } else {
        const res = await fetchDuckDuckGoSearch(termoBusca);
        setDdgResult(res);
      }
    } catch (err: any) {
      setSecError(err.message || `Erro ao consultar o buscador secundário (${mode}).`);
    } finally {
      setSecLoading(false);
    }
  };

  // Disparar LLM Customizada (OpenRouter, Groq, Ollama, DeepSeek)
  const handleRunCustomLlm = async () => {
    setActiveTab('llm_custom');
    if (!customLlmPrompt.trim()) return;

    setCustomLlmLoading(true);
    setCustomLlmError('');
    try {
      let promptCompleto = customLlmPrompt;
      
      // Se configurado para enriquecer com Buscadores Secundários (Grounding Híbrido)
      if (customLlmConfig.useSecondarySearchAsContext) {
        let resumoWiki = wikiResult?.extract || '';
        if (!resumoWiki) {
          try {
            const resW = await fetchWikipediaSearch(rua.homenageado || rua.nome);
            resumoWiki = resW.extract;
            setWikiResult(resW);
          } catch {
            // Ignora falha silenciosa se wiki não tiver verbete
          }
        }
        if (resumoWiki) {
          promptCompleto = `CONTEXTO FACTUAL (Extraído do Buscador Secundário - Wikipédia):\n"${resumoWiki}"\n\nPERGUNTA DO USUÁRIO:\n${customLlmPrompt}`;
        }
      }

      const res = await fetchCustomLLMChat(
        customLlmConfig,
        promptCompleto,
        `Você é um assistente historiador e analista cultural de ${cityName}/${cityState}. Via em foco: "${rua.nome}" (Batizada em honra a: ${rua.homenageado}). Resumo oficial: "${rua.resumo}".`
      );
      setCustomLlmResult(res.text);
    } catch (err: any) {
      setCustomLlmError(err.message || 'Erro ao consultar LLM customizada.');
    } finally {
      setCustomLlmLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#0a0a0b]/85 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div 
        className="relative w-full max-w-3xl bg-[#0f0f10] border-t md:border border-white/10 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[90vh] mt-auto md:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle para Mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2.5 md:hidden shrink-0" />

        {/* Cabeçalho do Modal */}
        <div className="p-6 bg-[#1a1a1c] border-b border-white/10 flex items-start justify-between gap-4 relative">
          <div className="flex items-start gap-3">
            <div 
              className="w-12 h-12 rounded flex items-center justify-center text-2xl shrink-0 shadow-lg border"
              style={{ backgroundColor: `${infoEixo.corHex}20`, borderColor: infoEixo.corHex }}
            >
              <span>{rua.iconeEmoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${infoEixo.corBgClass} ${infoEixo.corTextClass} ${infoEixo.corBorderClass}`}>
                  {infoEixo.label}
                </span>
                <span className="text-xs text-[#dcdcdc]/60 font-mono">📅 Batismo: {rua.decada}</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-[#f5f2ed] mt-1 tracking-tight">
                {rua.nome}
              </h2>
              <p className="text-xs text-[#c5a059] font-medium mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Homenageado(a): <strong className="text-white">{rua.homenageado}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#dcdcdc]/60 hover:text-[#f5f2ed] border border-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Fechar Ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação (Scrollável no mobile) */}
        <div className="flex border-b border-white/10 bg-[#0a0a0b]/60 px-4 md:px-6 gap-2 pt-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('historia')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all ${
              activeTab === 'historia'
                ? 'border-[#c5a059] text-[#c5a059] bg-[#1a1a1c]'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Contexto Histórico & Lei</span>
          </button>
          <button
            onClick={() => setActiveTab('lembrancas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all relative ${
              activeTab === 'lembrancas'
                ? 'border-[#c5a059] text-[#c5a059] bg-[#1a1a1c]'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/5'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Mural de Relatos Orais</span>
            <span className="bg-[#c5a059] text-black px-1.5 py-0.2 rounded font-mono text-[10px] font-bold">
              {lembrancas.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ia_grounding')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all min-h-[44px] ${
              activeTab === 'ia_grounding'
                ? 'border-[#c5a059] text-[#c5a059] bg-[#1a1a1c]'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
            <span>Enriquecimento IA (Google Search & Maps)</span>
          </button>
          <button
            onClick={() => setActiveTab('buscadores')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all min-h-[44px] ${
              activeTab === 'buscadores'
                ? 'border-[#c5a059] text-[#c5a059] bg-[#1a1a1c]'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4 text-[#58b38a]" />
            <span>Buscadores Secundários (Wiki/DDG)</span>
          </button>
          <button
            onClick={() => setActiveTab('llm_custom')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t border-b-2 transition-all min-h-[44px] ${
              activeTab === 'llm_custom'
                ? 'border-[#c5a059] text-[#c5a059] bg-[#1a1a1c]'
                : 'border-transparent text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#c5a059]" />
            <span>LLM Customizada (Converse)</span>
          </button>
        </div>

        {/* Conteúdo do Modal (Scrollável) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* ABA 1: CONTEXTO HISTÓRICO */}
          {activeTab === 'historia' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#0a0a0b]/60 border border-white/10 rounded p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-[#c5a059] font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#c5a059]" /> Biografia & Motivo de Batismo
                </h3>
                <p className="text-sm md:text-base text-[#dcdcdc] leading-relaxed font-normal font-serif">
                  {rua.resumo}
                </p>
              </div>

              {/* Box de Informações Legislativas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1a1a1c]/60 border border-white/10 rounded p-4">
                  <span className="text-[11px] text-[#dcdcdc]/60 font-mono block">📜 DECRETO / LEI MUNICIPAL</span>
                  <span className="text-sm font-semibold text-[#f5f2ed] mt-1 block">{rua.lei}</span>
                  <span className="text-xs text-[#dcdcdc]/60 mt-1 block">Ano estimado de batismo: <strong className="text-[#c5a059]">{rua.ano}</strong></span>
                </div>

                <div className="bg-[#1a1a1c]/60 border border-white/10 rounded p-4">
                  <span className="text-[11px] text-[#dcdcdc]/60 font-mono block">🏛️ FONTE OFICIAL</span>
                  <span className="text-sm font-semibold text-[#f5f2ed] mt-1 block">{rua.fonte}</span>
                  <a
                    href={rua.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#c5a059] hover:text-white font-medium mt-1 transition-colors"
                  >
                    <span>Consultar acervo legislativo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Botões para enriquecimento IA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#dcdcdc]/70">
                  💡 Quer saber mais sobre a vida dessa pessoa ou comércio atual da rua?
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleRunSearchGrounding}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-semibold text-xs shadow-md shadow-[#c5a059]/20 transition-all"
                  >
                    <Search className="w-4 h-4" />
                    <span>Pesquisar no Google (IA)</span>
                  </button>
                  <button
                    onClick={handleRunMapsGrounding}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#58b38a] hover:bg-[#6ace9e] text-black font-semibold text-xs shadow-md shadow-[#58b38a]/20 transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Explorar Locais (Maps)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: MURAL DE RELATOS ORAIS */}
          {activeTab === 'lembrancas' && (
            <div className="space-y-6 animate-fadeIn">
              
              {formSuccess && (
                <div className="bg-[#58b38a]/15 border border-[#58b38a]/40 text-[#f5f2ed] p-4 rounded flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#58b38a]" />
                  <p className="text-xs font-medium">
                    Sua lembrança de família foi enviada com sucesso e está armazenada no seu navegador (localStorage)!
                  </p>
                </div>
              )}

              {/* Botão Abrir Formulário */}
              {!showForm ? (
                <div className="flex items-center justify-between bg-[#1a1a1c] border border-[#c5a059]/30 p-5 rounded">
                  <div>
                    <h4 className="text-sm font-bold text-[#f5f2ed] font-serif">Tem alguma história ou lembrança desta rua?</h4>
                    <p className="text-xs text-[#dcdcdc]/70 mt-0.5">
                      Ajude a preservar a memória oral de {cityName} compartilhando sua vivência ou causo de família.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2.5 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-lg shadow-[#c5a059]/20 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Enviar Lembrança</span>
                  </button>
                </div>
              ) : (
                /* Formulário Interativo */
                <form onSubmit={handleSubmitRelato} className="bg-[#0a0a0b]/90 border border-[#c5a059]/40 p-5 rounded space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-bold font-serif text-sm text-[#c5a059] flex items-center gap-2">
                      <MessageSquarePlus className="w-4 h-4" /> Compartilhar Lembrança de Família
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-[#dcdcdc]/60 hover:text-white text-xs"
                    >
                      Cancelar
                    </button>
                  </div>

                  {formError && (
                    <div className="text-xs text-[#d9777f] bg-[#d9777f]/10 border border-[#d9777f]/30 p-3 rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#dcdcdc] mb-1">Seu Nome / Família *</label>
                      <input
                        type="text"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-[#1a1a1c] border border-white/10 rounded px-3 py-2 text-xs text-[#f5f2ed] focus:outline-none focus:border-[#c5a059]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#dcdcdc] mb-1">Sua Relação com a Via</label>
                      <select
                        value={relacao}
                        onChange={(e) => setRelacao(e.target.value)}
                        className="w-full bg-[#1a1a1c] border border-white/10 rounded px-3 py-2 text-xs text-[#f5f2ed] focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="Morador antigo">Morador(a) antigo(a)</option>
                        <option value="Morador atual">Morador(a) atual</option>
                        <option value="Parente da família">Parente / Descendente</option>
                        <option value="Ex-trabalhador da rua">Ex-trabalhador / Comerciante</option>
                        <option value="Historiador local">Historiador / Pesquisador</option>
                        <option value="Amigo da família">Amigo da família</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#dcdcdc] mb-1">Época / Período</label>
                      <input
                        type="text"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        placeholder="Ex: Anos 1970 ou Infância"
                        className="w-full bg-[#1a1a1c] border border-white/10 rounded px-3 py-2 text-xs text-[#f5f2ed] focus:outline-none focus:border-[#c5a059]"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#dcdcdc] mb-1">Seu Relato / Memória Oral *</label>
                    <textarea
                      value={relato}
                      onChange={(e) => setRelato(e.target.value)}
                      rows={4}
                      placeholder="Escreva aqui uma lembrança afetiva, causo de quermesse, como era o chão de terra, ou como a pessoa homenageada ajudava a comunidade..."
                      className="w-full bg-[#1a1a1c] border border-white/10 rounded p-3 text-xs text-[#f5f2ed] focus:outline-none focus:border-[#c5a059] leading-relaxed font-serif"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-md shadow-[#c5a059]/20 transition-all"
                    >
                      Publicar no Mural (localStorage)
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Relatos */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a059] font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#c5a059]" /> Relatos Orais & Lembranças Cadastradas ({lembrancas.length})
                </h4>

                {lembrancas.length === 0 ? (
                  <div className="p-8 text-center bg-[#0a0a0b]/60 rounded border border-white/10">
                    <MessageSquarePlus className="w-8 h-8 text-[#dcdcdc]/30 mx-auto mb-2" />
                    <p className="text-xs font-serif font-bold text-[#f5f2ed]">Nenhum relato oral cadastrado para esta via ainda.</p>
                    <p className="text-[11px] text-[#dcdcdc]/60 mt-0.5">Seja o primeiro a enviar uma lembrança de família acima!</p>
                  </div>
                ) : (
                  lembrancas.map((lem) => (
                    <div key={lem.id} className="p-4 rounded bg-[#0a0a0b]/60 border border-white/10 space-y-2.5 transition-all hover:border-white/20">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif font-bold text-sm text-[#c5a059] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#c5a059]" /> {lem.autor}
                          </span>
                          <span className="text-[10px] bg-[#1a1a1c] text-[#dcdcdc] px-2 py-0.5 rounded border border-white/10">
                            {lem.relacao}
                          </span>
                          <span className="text-[10px] bg-[#c5a059]/15 text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30 font-mono font-bold">
                            ⏳ {lem.periodo}
                          </span>
                        </div>

                        <span className="text-[10px] text-[#dcdcdc]/50 font-mono shrink-0">
                          {new Date(lem.dataEnvio).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed font-normal bg-[#1a1a1c]/60 p-3 rounded border border-white/5 font-serif italic">
                        "{lem.relato}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleCurtir(lem.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#d9777f]/10 hover:bg-[#d9777f]/20 text-[#d9777f] border border-[#d9777f]/30 text-xs font-medium transition-all group"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#d9777f] group-hover:scale-125 transition-transform" fill="currentColor" />
                          <span>Curtir relato</span>
                          <span className="bg-[#d9777f]/20 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold">
                            {lem.curtidas}
                          </span>
                        </button>
                        <span className="text-[10px] text-[#dcdcdc]/40 font-mono">Armazenado em localStorage</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ABA 3: ENRIQUECIMENTO IA COM GOOGLE SEARCH / MAPS GROUNDING */}
          {activeTab === 'ia_grounding' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#0a0a0b]/60 p-4 rounded border border-white/10 gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c5a059]" />
                  <div>
                    <h4 className="text-sm font-bold font-serif text-[#f5f2ed]">Inteligência Artificial Google (Gemini 3.5 Flash)</h4>
                    <p className="text-xs text-[#dcdcdc]/60">Pesquisa em tempo real com grounding no Google Search e Google Maps.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleRunSearchGrounding}
                    disabled={aiLoading}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      aiMode === 'search'
                        ? 'bg-[#c5a059] text-black shadow-md shadow-[#c5a059]/20 font-bold'
                        : 'bg-[#1a1a1c] text-[#dcdcdc]/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Grounding</span>
                  </button>
                  <button
                    onClick={handleRunMapsGrounding}
                    disabled={aiLoading}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      aiMode === 'maps'
                        ? 'bg-[#58b38a] text-black shadow-md shadow-[#58b38a]/20 font-bold'
                        : 'bg-[#1a1a1c] text-[#dcdcdc]/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Maps Grounding</span>
                  </button>
                </div>
              </div>

              {/* Estado de Carregamento */}
              {aiLoading && (
                <div className="p-12 text-center bg-[#0a0a0b]/60 rounded border border-white/10 flex flex-col items-center justify-center gap-3 animate-pulse">
                  <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                  <div>
                    <h5 className="font-bold font-serif text-sm text-[#f5f2ed]">
                      {aiMode === 'search' ? 'Pesquisando História no Google...' : 'Consultando Locais no Google Maps...'}
                    </h5>
                    <p className="text-xs text-[#dcdcdc]/60 mt-1 font-mono">
                      O Gemini está analisando fontes da web para enriquecer a memória cultural de "{rua.nome}".
                    </p>
                  </div>
                </div>
              )}

              {/* Erro de IA */}
              {aiError && !aiLoading && (
                <div className="bg-[#d9777f]/15 border border-[#d9777f]/30 text-[#f5f2ed] p-4 rounded flex items-center gap-3 font-mono">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#d9777f]" />
                  <p className="text-xs">{aiError}</p>
                </div>
              )}

              {/* Resultado Search Grounding (@[Use Google Search data]) */}
              {aiMode === 'search' && searchGroundingResult && !aiLoading && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-[#0a0a0b]/90 border border-[#c5a059]/30 rounded p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        🔍 Contexto Biográfico & Histórico (Google Search Grounding)
                      </span>
                      <span className="text-[10px] bg-[#c5a059]/15 text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30 font-mono font-bold">
                        Modelo: gemini-3.5-flash
                      </span>
                    </div>

                    <div className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed space-y-3 font-normal prose prose-invert max-w-none font-serif">
                      <ReactMarkdown>{searchGroundingResult.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Citações / Fontes Web */}
                  {searchGroundingResult.citations && searchGroundingResult.citations.length > 0 && (
                    <div className="bg-[#1a1a1c]/60 border border-white/10 rounded p-4 space-y-2">
                      <h5 className="text-xs font-bold text-[#f5f2ed] flex items-center gap-1.5 font-mono">
                        <Share2 className="w-3.5 h-3.5 text-[#c5a059]" /> Fontes & Citações Web Encontradas (Google Search):
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {searchGroundingResult.citations.map((cite, idx) => (
                          <a
                            key={idx}
                            href={cite.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#c5a059] hover:text-white text-[11px] border border-white/10 transition-all truncate max-w-xs font-mono"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{cite.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resultado Maps Grounding (@[Use Google Maps data]) */}
              {aiMode === 'maps' && mapsGroundingResult && !aiLoading && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-[#0a0a0b]/90 border border-[#58b38a]/30 rounded p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold text-[#58b38a] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        📍 Comércio, Serviços & Entorno Atual (Google Maps Grounding)
                      </span>
                      <span className="text-[10px] bg-[#58b38a]/15 text-[#58b38a] px-2 py-0.5 rounded border border-[#58b38a]/30 font-mono font-bold">
                        Modelo: gemini-3.5-flash • ({rua.lat}, {rua.lng})
                      </span>
                    </div>

                    <div className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed space-y-3 font-normal prose prose-invert max-w-none font-serif">
                      <ReactMarkdown>{mapsGroundingResult.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Citações / Fontes Maps */}
                  {mapsGroundingResult.citations && mapsGroundingResult.citations.length > 0 && (
                    <div className="bg-[#1a1a1c]/60 border border-white/10 rounded p-4 space-y-2">
                      <h5 className="text-xs font-bold text-[#f5f2ed] flex items-center gap-1.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#58b38a]" /> Referências Geográficas (Google Maps):
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {mapsGroundingResult.citations.map((cite, idx) => (
                          <a
                            key={idx}
                            href={cite.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#58b38a] hover:text-white text-[11px] border border-white/10 transition-all truncate max-w-xs font-mono"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{cite.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botões Iniciais se nenhum foi clicado ainda */}
              {!searchGroundingResult && !mapsGroundingResult && !aiLoading && (
                <div className="p-8 text-center bg-[#0a0a0b]/60 rounded border border-white/10 space-y-4">
                  <Sparkles className="w-10 h-10 text-[#c5a059] mx-auto animate-bounce" />
                  <div>
                    <h5 className="font-bold font-serif text-sm text-[#f5f2ed]">Enriquecimento em Tempo Real</h5>
                    <p className="text-xs text-[#dcdcdc]/60 mt-1 max-w-md mx-auto">
                      Escolha acima se deseja realizar o grounding histórico de biografias (Google Search) ou explorar pontos de interesse no bairro (Google Maps).
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleRunSearchGrounding}
                      className="px-4 py-2 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-md"
                    >
                      Search Grounding
                    </button>
                    <button
                      onClick={handleRunMapsGrounding}
                      className="px-4 py-2 rounded bg-[#58b38a] hover:bg-[#6ace9e] text-black font-bold text-xs shadow-md"
                    >
                      Maps Grounding
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ABA 4: BUSCADORES SECUNDÁRIOS (WIKIPÉDIA / DUCKDUCKGO) */}
          {activeTab === 'buscadores' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#1a1a1c] border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#f5f2ed] flex items-center gap-1.5 font-mono">
                    <Globe className="w-4 h-4 text-[#58b38a]" /> Buscadores Secundários em Tempo Real
                  </h4>
                  <p className="text-[11px] text-[#dcdcdc]/60 mt-0.5">
                    Resumos biográficos da Wikipédia em Português e busca instantânea DuckDuckGo sem rastreamento
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleRunSecondarySearch('wiki')}
                    disabled={secLoading && secMode === 'wiki'}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer ${
                      secMode === 'wiki' && (wikiResult || secLoading)
                        ? 'bg-[#58b38a] text-black shadow-lg'
                        : 'bg-[#0a0a0b] text-[#dcdcdc] hover:bg-white/10 border border-white/15'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Wikipédia</span>
                  </button>
                  <button
                    onClick={() => handleRunSecondarySearch('ddg')}
                    disabled={secLoading && secMode === 'ddg'}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer ${
                      secMode === 'ddg' && (ddgResult || secLoading)
                        ? 'bg-[#c5a059] text-black shadow-lg'
                        : 'bg-[#0a0a0b] text-[#dcdcdc] hover:bg-white/10 border border-white/15'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>DuckDuckGo</span>
                  </button>
                </div>
              </div>

              {/* Loader */}
              {secLoading && (
                <div className="p-8 text-center bg-[#0a0a0b]/60 rounded-xl border border-white/10 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#58b38a] animate-spin mx-auto" />
                  <p className="text-xs text-[#dcdcdc] font-mono animate-pulse">
                    Consultando {secMode === 'wiki' ? 'a Wikipédia PT' : 'o DuckDuckGo Instant API'}...
                  </p>
                </div>
              )}

              {/* Erro */}
              {secError && !secLoading && (
                <div className="bg-[#e76f51]/15 border border-[#e76f51]/30 text-[#f5f2ed] p-4 rounded-xl flex items-center gap-3 font-mono">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#e76f51]" />
                  <p className="text-xs">{secError}</p>
                </div>
              )}

              {/* Resultado Wikipédia */}
              {secMode === 'wiki' && wikiResult && !secLoading && (
                <div className="bg-[#0a0a0b]/90 border border-[#58b38a]/30 rounded-xl p-5 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-[#58b38a] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      📖 Wikipédia em Português (Action/Summary API)
                    </span>
                    <a
                      href={wikiResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#c5a059] hover:underline font-mono min-h-[36px]"
                    >
                      <span>Abrir verbete original</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {wikiResult.thumbnail && (
                      <img
                        src={wikiResult.thumbnail}
                        alt={wikiResult.title}
                        className="w-24 h-32 object-cover rounded-lg border border-white/15 shrink-0 shadow-md mx-auto sm:mx-0"
                      />
                    )}
                    <div className="space-y-2 flex-1">
                      <h4 className="text-base font-bold text-[#f5f2ed] font-serif">{wikiResult.title}</h4>
                      <p className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed font-serif">
                        {wikiResult.extract}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resultado DuckDuckGo */}
              {secMode === 'ddg' && ddgResult && !secLoading && (
                <div className="bg-[#0a0a0b]/90 border border-[#c5a059]/30 rounded-xl p-5 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      🦆 DuckDuckGo Instant Answers & Tópicos
                    </span>
                    <a
                      href={ddgResult.abstractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#58b38a] hover:underline font-mono min-h-[36px]"
                    >
                      <span>Busca web no DuckDuckGo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-[#f5f2ed] font-serif">{ddgResult.heading}</h4>
                    <p className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed font-serif">
                      {ddgResult.abstract}
                    </p>

                    {ddgResult.relatedTopics && ddgResult.relatedTopics.length > 0 && (
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <span className="text-xs font-bold text-[#f5f2ed] block font-mono">🔗 Links Relacionados (DuckDuckGo):</span>
                        <div className="space-y-1.5">
                          {ddgResult.relatedTopics.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.FirstURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2.5 rounded bg-[#1a1a1c]/60 hover:bg-white/10 text-xs text-[#58b38a] hover:text-white border border-white/10 transition-colors truncate font-mono"
                            >
                              <span className="font-semibold text-[#f5f2ed]">{item.Text}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!wikiResult && !ddgResult && !secLoading && (
                <div className="p-8 text-center bg-[#0a0a0b]/60 rounded-xl border border-white/10 space-y-4">
                  <Globe className="w-10 h-10 text-[#58b38a] mx-auto animate-bounce" />
                  <div>
                    <h5 className="font-bold font-serif text-sm text-[#f5f2ed]">Exploração sem Rastreamento</h5>
                    <p className="text-xs text-[#dcdcdc]/60 mt-1 max-w-md mx-auto">
                      Selecione um dos motores acima para obter biografias e dados históricos sem depender apenas dos algoritmos principais.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleRunSecondarySearch('wiki')}
                      className="px-4 py-2 rounded-xl bg-[#58b38a] hover:bg-[#6ace9e] text-black font-bold text-xs shadow-md cursor-pointer min-h-[44px]"
                    >
                      Pesquisar na Wikipédia
                    </button>
                    <button
                      onClick={() => handleRunSecondarySearch('ddg')}
                      className="px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-md cursor-pointer min-h-[44px]"
                    >
                      Resumo DuckDuckGo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 5: LLM CUSTOMIZADA (MODELOS LIVRES) */}
          {activeTab === 'llm_custom' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#1a1a1c] border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#f5f2ed] flex items-center gap-1.5 font-mono">
                    <Cpu className="w-4 h-4 text-[#c5a059]" /> Consulta com LLM Personalizada / Endpoint Livre
                  </h4>
                  <p className="text-[11px] text-[#dcdcdc]/60 mt-0.5">
                    Provedor atual: <span className="text-[#c5a059] font-semibold uppercase">{customLlmConfig.provider}</span> • Modelo: <span className="text-[#58b38a] font-mono">{customLlmConfig.modelName}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border ${
                    customLlmConfig.useSecondarySearchAsContext
                      ? 'bg-[#58b38a]/15 text-[#58b38a] border-[#58b38a]/30'
                      : 'bg-white/5 text-[#dcdcdc]/60 border-white/10'
                  }`}>
                    {customLlmConfig.useSecondarySearchAsContext ? '🟢 Grounding Wiki Ativo' : '⚪ Sem Grounding'}
                  </span>
                </div>
              </div>

              {/* Caixa de Prompt */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#dcdcdc] font-mono">
                  Faça uma pergunta sobre a via ou peça uma análise histórica/biográfica:
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={customLlmPrompt}
                    onChange={(e) => setCustomLlmPrompt(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    rows={3}
                    className="w-full bg-[#0a0a0b] border border-white/15 rounded-xl p-3 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none font-serif leading-relaxed"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRunCustomLlm}
                  disabled={customLlmLoading || !customLlmPrompt.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-[#c5a059] hover:bg-[#b08d48] text-black font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 cursor-pointer"
                >
                  {customLlmLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando com {customLlmConfig.modelName}...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Perguntar ao Modelo ({customLlmConfig.modelName})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Erro */}
              {customLlmError && !customLlmLoading && (
                <div className="bg-[#e76f51]/15 border border-[#e76f51]/30 text-[#f5f2ed] p-4 rounded-xl flex items-center gap-3 font-mono">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#e76f51]" />
                  <p className="text-xs">{customLlmError}</p>
                </div>
              )}

              {/* Resultado da LLM */}
              {customLlmResult && !customLlmLoading && (
                <div className="bg-[#0a0a0b]/90 border border-[#c5a059]/30 rounded-xl p-5 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      ✨ Resposta Gerada ({customLlmConfig.modelName})
                    </span>
                    {customLlmConfig.useSecondarySearchAsContext && (
                      <span className="text-[10px] bg-[#58b38a]/15 text-[#58b38a] px-2 py-0.5 rounded border border-[#58b38a]/30 font-mono">
                        Enriquecido por Wikipédia
                      </span>
                    )}
                  </div>

                  <div className="text-xs md:text-sm text-[#dcdcdc] leading-relaxed space-y-3 font-normal prose prose-invert max-w-none font-serif">
                    <ReactMarkdown>{customLlmResult}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Rodapé de Ações do Modal */}
        <div className="p-4 bg-[#0a0a0b] border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#dcdcdc]/50 font-mono">
            📍 ID da via: {rua.id} • {cityName}/{cityState}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#1a1a1c] hover:bg-white/10 text-[#f5f2ed] font-semibold text-xs border border-white/10 transition-colors"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
