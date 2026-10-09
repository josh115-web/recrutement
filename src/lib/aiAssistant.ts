import { HRMetrics, HRDecision } from '@/types'

export interface AIGenerationInput {
  memberName: string;
  departmentName: string;
  speciality: string;
  metrics: HRMetrics;
  hrScore: number;
  decision: HRDecision;
  apiKey?: string;
}

export interface AIGenerationResult {
  hrInsight: string;
  hrComment: string;
  objectives: string[];
}

export async function generateHREvaluationAI(input: AIGenerationInput): Promise<AIGenerationResult> {
  const { memberName, departmentName, hrScore, decision, apiKey } = input

  // If user provided an OpenAI API key in settings, call OpenAI API
  if (apiKey && apiKey.trim().startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are the executive HR Director for Petroleum Club Skikda (PCS), an elite petroleum engineering student club. Slogan: "Step by Step We'll Make It Up". Write inspiring, highly professional HR evaluations in French. Never use generic corporate jargon.`,
            },
            {
              role: 'user',
              content: `Generate an evaluation for member ${memberName} in ${departmentName}. HR Score: ${hrScore}/100. Decision: ${decision}. Return valid JSON with keys: "hrInsight" (string), "hrComment" (string), "objectives" (array of 3 strings).`,
            },
          ],
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          return {
            hrInsight: parsed.hrInsight || 'Membre très engagé dans la dynamique du Petroleum Club Skikda.',
            hrComment: parsed.hrComment || 'Poursuivre avec la même rigueur et l\'esprit d\'initiative.',
            objectives: parsed.objectives || [
              'Participer activement aux réunions du département',
              'Finaliser les livrables dans les délais impartis',
              'Encourager la cohésion d\'équipe',
            ],
          }
        }
      }
    } catch (e) {
      console.warn('OpenAI API call failed, falling back to smart local generator:', e)
    }
  }

  // Smart local engine fallback tailored for Petroleum Club Skikda
  await new Promise(r => setTimeout(r, 600)) // simulate smooth AI thinking state

  if (hrScore >= 90) {
    return {
      hrInsight: `${memberName} fait preuve d'un leadership exceptionnel au sein du département ${departmentName}. Son implication exemplaire et la précision de ses livrables incarnent parfaitement le slogan du club: "Step by Step We'll Make It Up".`,
      hrComment: `Performance brillante. Recommandé(e) pour encadrer les nouveaux membres et participer activement aux préparatifs des événements majeurs du Petroleum Club Skikda.`,
      objectives: [
        `Prendre le lead sur la coordination des prochains livrables du département ${departmentName}`,
        'Accompagner et mentorer 2 nouveaux membres dans leur intégration',
        'Maintenir un taux de présence de 100% lors des assemblées générales',
      ],
    }
  } else if (hrScore >= 75) {
    return {
      hrInsight: `Travail régulier et solide de ${memberName}. Bonne intégration dans l'équipe ${departmentName} avec une participation constante aux projets du club.`,
      hrComment: `Membre précieux et fiable. En renforçant encore la prise d'initiative et l'activité média, le passage au niveau supérieur est très envisageable.`,
      objectives: [
        'Proposer au moins 2 nouvelles initiatives innovantes pour le mois à venir',
        'Améliorer la ponctualité sur le rendu des livrables',
        'Participer activement à la promotion des activités PCS sur les réseaux',
      ],
    }
  } else {
    return {
      hrInsight: `Le potentiel de ${memberName} est évident, mais des efforts de régularité et de présence aux réunions du département ${departmentName} sont nécessaires pour atteindre les standards du club.`,
      hrComment: `Plan d'accompagnement recommandé. Un entretien de cadrage avec le chef de département permettra de lever les blocages organisationnels.`,
      objectives: [
        'Assister à 100% des réunions hebdomadaires du mois à venir',
        'Mettre à jour régulièrement son statut d\'avancement auprès du chef d\'équipe',
        'S\'investir dans au moins une sous-commission événementielle PCS',
      ],
    }
  }
}
