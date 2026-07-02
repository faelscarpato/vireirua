import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Inicialização do cliente Gemini
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não está configurada em Secret / Variáveis de Ambiente.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route de Verificação de Saúde
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API 1: Enriquecimento Histórico com Google Search Grounding (@[Use Google Search data])
  app.post("/api/gemini/search-grounding", async (req, res) => {
    try {
      const { ruaNome, homenageado, resumoAtual } = req.body;
      if (!ruaNome) {
        return res.status(400).json({ error: "Nome da rua é obrigatório" });
      }

      const ai = getAiClient();
      const prompt = `Por favor, pesquise na web e forneça uma biografia detalhada e o contexto histórico de: "${homenageado}" (ou sobre o nome "${ruaNome}" em Pedreira / Estado de São Paulo / Brasil).
Resumo atualmente cadastrado: "${resumoAtual || 'Não disponível'}".

Explique de forma acolhedora, confiável e didática:
1. 📜 **Quem foi a pessoa ou qual o significado histórico** por trás desse nome.
2. 🏛️ **Por que essa homenagem é relevante** para a memória cultural ou cívica do Brasil ou do Circuito das Águas / Pedreira.
3. 🌟 **Curiosidades ou fatos marcantes** sobre o período histórico em que essa pessoa viveu ou o evento celebrou.

Formate em Markdown bem estruturado, com negritos e subtítulos.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é um historiador especialista na memória cultural, militar, industrial e cívica do Brasil e da região de Pedreira/SP (Capital da Porcelana). Seu objetivo é resgatar com precisão o contexto de batismo e história das vias públicas.",
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Nenhuma informação detalhada encontrada.";
      
      // Extrair URLs de citação de Search Grounding
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const citations: { title: string; uri: string }[] = [];
      
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          citations.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });

      res.json({
        text,
        citations,
      });
    } catch (error: any) {
      console.error("Erro em /api/gemini/search-grounding:", error);
      res.status(500).json({ 
        error: "Falha ao pesquisar contexto histórico.", 
        details: error.message || String(error) 
      });
    }
  });

  // API 2: Enriquecimento Geográfico com Google Maps Grounding (@[Use Google Maps data])
  app.post("/api/gemini/maps-grounding", async (req, res) => {
    try {
      const { ruaNome, lat, lng, bairro } = req.body;
      if (!ruaNome || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "Nome da rua e coordenadas (lat, lng) são obrigatórios" });
      }

      const ai = getAiClient();
      const prompt = `Explore no Google Maps e descreva o entorno e pontos de interesse ao redor da via "${ruaNome}" (Bairro/Região: ${bairro || 'Pedreira/SP'}), coordenadas aproximadas (${lat}, ${lng}).

Por favor, apresente:
1. 📍 **Caracterização da Região**: Como é o bairro, o comércio ou a atmosfera local (residencial, industrial, arborizada, central).
2. 🏪 **Pontos de Referência e Serviços Próximos**: Escolas, pracinhas, igrejas, comércio de porcelanas, restaurantes ou instituições da comunidade por perto.
3. 🚶 **Dica de Passeio ou Visitação**: O que o cidadão ou visitante de Pedreira pode apreciar nessa vizinhança.

Formate em Markdown acolhedor e informativo.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é um guia cultural e comunitário de Pedreira/SP. Conhece a malha urbana, as alamedas, as lojas de louças e o rio Jaguari. Ajude o usuário a conhecer o presente da via e sua integração com a cidade.",
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(lat),
                longitude: Number(lng),
              },
            },
          },
        },
      });

      const text = response.text || "Nenhuma informação geográfica recente encontrada no Google Maps.";

      // Extrair URLs de citação de Maps Grounding
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const citations: { title: string; uri: string }[] = [];

      groundingChunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
          citations.push({
            title: chunk.maps.title || `Local em ${ruaNome}`,
            uri: chunk.maps.uri,
          });
        }
      });

      res.json({
        text,
        citations,
      });
    } catch (error: any) {
      console.error("Erro em /api/gemini/maps-grounding:", error);
      res.status(500).json({ 
        error: "Falha ao consultar locais no Google Maps.", 
        details: error.message || String(error) 
      });
    }
  });

  // API 3: Buscador Secundário - Wikipedia API (Resumo Histórico/Biográfico)
  app.post("/api/secondary-search/wikipedia", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "O termo de busca (query) é obrigatório" });
      }

      // 1º Tentar buscar resumo direto da API REST do Wikipedia PT
      const cleanTerm = encodeURIComponent(query.trim());
      const summaryRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${cleanTerm}`);
      
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        if (data && data.extract && data.type !== 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
          return res.json({
            title: data.title || query,
            extract: data.extract,
            thumbnail: data.thumbnail?.source || null,
            url: data.content_urls?.desktop?.page || `https://pt.wikipedia.org/wiki/${cleanTerm}`,
          });
        }
      }

      // 2º Se não encontrou summary direto, fazer busca textual no Wikipedia PT
      const searchRes = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${cleanTerm}&format=json&utf8=1&srlimit=1`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const firstHit = searchData?.query?.search?.[0];
        if (firstHit && firstHit.title) {
          const hitTitleClean = encodeURIComponent(firstHit.title);
          const hitSummaryRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${hitTitleClean}`);
          if (hitSummaryRes.ok) {
            const hitData = await hitSummaryRes.json();
            return res.json({
              title: hitData.title || firstHit.title,
              extract: hitData.extract || firstHit.snippet.replace(/<[^>]*>?/gm, ''),
              thumbnail: hitData.thumbnail?.source || null,
              url: hitData.content_urls?.desktop?.page || `https://pt.wikipedia.org/wiki/${hitTitleClean}`,
            });
          }
        }
      }

      res.status(404).json({ error: "Nenhum verbete encontrado na Wikipédia para este termo." });
    } catch (error: any) {
      console.error("Erro em /api/secondary-search/wikipedia:", error);
      res.status(500).json({ error: "Falha ao consultar a Wikipédia.", details: error.message });
    }
  });

  // API 4: Buscador Secundário - DuckDuckGo Instant Answer / HTML Search Summaries
  app.post("/api/secondary-search/duckduckgo", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "O termo de busca (query) é obrigatório" });
      }

      const cleanQuery = encodeURIComponent(query.trim());
      const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${cleanQuery}&format=json&no_html=1&skip_disambig=1&kl=br-pt`);
      
      if (!ddgRes.ok) {
        return res.status(ddgRes.status).json({ error: "Falha na comunicação com DuckDuckGo" });
      }

      const data = await ddgRes.json();
      const relatedTopics: { Text: string; FirstURL: string }[] = [];

      if (Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 5).forEach((item: any) => {
          if (item.Text && item.FirstURL) {
            relatedTopics.push({ Text: item.Text, FirstURL: item.FirstURL });
          }
        });
      }

      res.json({
        heading: data.Heading || query,
        abstract: data.AbstractText || data.Abstract || (relatedTopics[0]?.Text || "Nenhum resumo instantâneo retornado. Consulte os links relacionados abaixo."),
        abstractSource: data.AbstractSource || "DuckDuckGo Instant Answers",
        abstractUrl: data.AbstractURL || `https://duckduckgo.com/?q=${cleanQuery}`,
        relatedTopics,
      });
    } catch (error: any) {
      console.error("Erro em /api/secondary-search/duckduckgo:", error);
      res.status(500).json({ error: "Falha ao consultar o DuckDuckGo.", details: error.message });
    }
  });

  // API 5: LLM Personalizada / Endpoints Livres (OpenRouter, Groq, Ollama, OpenAI, Gemini customizado)
  app.post("/api/custom-llm/chat", async (req, res) => {
    try {
      const { endpointUrl, apiKey, modelName, prompt, systemInstruction, temperature = 0.7 } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "O prompt é obrigatório" });
      }

      // Se o usuário não definiu endpoint customizado (ou escolheu padrão), usar o SDK oficial Gemini com gemini-3.5-flash
      if (!endpointUrl || endpointUrl.trim() === '') {
        const ai = getAiClient();
        const modelToUse = modelName && modelName.trim() !== '' ? modelName : "gemini-2.5-flash";
        const response = await ai.models.generateContent({
          model: modelToUse,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || "Você é um historiador especialista na memória cultural de Pedreira/SP.",
            temperature: Number(temperature),
          },
        });
        return res.json({ text: response.text || "Sem resposta gerada pelo modelo." });
      }

      // Caso contrário, fazer chamada REST para o Endpoint Customizado (compatível com OpenAI / OpenRouter / Ollama / Groq)
      const cleanEndpoint = endpointUrl.trim().replace(/\/$/, "");
      const targetUrl = cleanEndpoint.endsWith("/chat/completions") || cleanEndpoint.endsWith("/generate") || cleanEndpoint.endsWith("/api/generate")
        ? cleanEndpoint
        : `${cleanEndpoint}/chat/completions`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey && apiKey.trim() !== '') {
        headers["Authorization"] = `Bearer ${apiKey.trim()}`;
      }

      // Se for formato Ollama nativo (/api/generate)
      if (targetUrl.endsWith("/api/generate") || targetUrl.endsWith("/generate")) {
        const ollamaRes = await fetch(targetUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelName || "llama3",
            prompt: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt,
            stream: false,
            options: { temperature: Number(temperature) },
          }),
        });
        if (!ollamaRes.ok) {
          const errText = await ollamaRes.text().catch(() => "");
          return res.status(ollamaRes.status).json({ error: `Erro no Endpoint Customizado (${ollamaRes.status}): ${errText}` });
        }
        const ollamaData = await ollamaRes.json();
        return res.json({ text: ollamaData.response || ollamaData.text || "Sem resposta retornada pelo Ollama." });
      }

      // Formato padrão OpenAI / OpenRouter / Groq (/chat/completions)
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const customRes = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modelName || "gpt-3.5-turbo",
          messages,
          temperature: Number(temperature),
        }),
      });

      if (!customRes.ok) {
        const errText = await customRes.text().catch(() => "");
        return res.status(customRes.status).json({ error: `Erro na API Customizada (${customRes.status}): ${errText}` });
      }

      const customData = await customRes.json();
      const replyText = customData.choices?.[0]?.message?.content || customData.response || JSON.stringify(customData);
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Erro em /api/custom-llm/chat:", error);
      res.status(500).json({ error: "Falha na comunicação com LLM personalizada.", details: error.message });
    }
  });

  // Vite middleware para desenvolvimento, ou arquivos estáticos em produção
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌟 Servidor 'Ruas com História - Pedreira/SP' rodando em http://localhost:${PORT}`);
  });
}

startServer();
