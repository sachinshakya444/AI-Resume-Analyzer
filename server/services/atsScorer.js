// Important ATS sections jo resume mein hone chahiye
const IMPORTANT_SECTIONS = [
    'experience', 'education', 'skills', 'projects',
    'summary', 'objective', 'certifications', 'achievements'
  ]
  
  // Common action verbs jo strong resume mein hote hain
  const ACTION_VERBS = [
    'developed', 'built', 'designed', 'implemented', 'managed',
    'led', 'created', 'improved', 'optimized', 'delivered',
    'achieved', 'increased', 'reduced', 'automated', 'deployed'
  ]
  
  // Resume text se keywords extract karo
  export const extractKeywords = (text) => {
    const lower = text.toLowerCase()
  
    // Common words jo ignore karni hain
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
      'for', 'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were',
      'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'shall', 'can',
      'this', 'that', 'these', 'those', 'i', 'my', 'me', 'we', 'our'
    ])
  
    // Text clean karo aur words extract karo
    const words = lower
      .replace(/[^a-z0-9\s+#]/g, ' ')  // special chars hata do
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
  
    // Unique words return karo
    return [...new Set(words)]
  }
  
  // ATS Score calculate karo
  export const calculateATSScore = (resumeText, jobDescription) => {
    const resumeLower = resumeText.toLowerCase()
    const scores = {}
  
    // ── 1. Section Score (25 points) ──
    const foundSections = IMPORTANT_SECTIONS.filter(section =>
      resumeLower.includes(section)
    )
    scores.sectionScore = Math.round((foundSections.length / IMPORTANT_SECTIONS.length) * 25)
  
    // ── 2. Keyword Match Score (40 points) ──
    const jdKeywords = extractKeywords(jobDescription)
    const resumeKeywords = extractKeywords(resumeText)
  
    const matchedKeywords = jdKeywords.filter(kw => resumeKeywords.includes(kw))
    const missingKeywords = jdKeywords.filter(kw => !resumeKeywords.includes(kw))
  
    scores.keywordScore = jdKeywords.length > 0
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 40)
      : 0
  
    // ── 3. Action Verb Score (20 points) ──
    const foundVerbs = ACTION_VERBS.filter(verb => resumeLower.includes(verb))
    scores.actionVerbScore = Math.round((foundVerbs.length / ACTION_VERBS.length) * 20)
  
    // ── 4. Length Score (15 points) ──
    // Resume 300-1000 words ke beech hona chahiye
    const wordCount = resumeText.split(/\s+/).length
    if (wordCount >= 300 && wordCount <= 1000) {
      scores.lengthScore = 15
    } else if (wordCount >= 200 && wordCount < 300) {
      scores.lengthScore = 10
    } else if (wordCount > 1000 && wordCount <= 1500) {
      scores.lengthScore = 10
    } else {
      scores.lengthScore = 5
    }
  
    // ── Total Score ──
    const totalScore = scores.sectionScore + scores.keywordScore +
      scores.actionVerbScore + scores.lengthScore
  
    return {
      totalScore: Math.min(totalScore, 100), // max 100
      breakdown: {
        sections: { score: scores.sectionScore, max: 25, found: foundSections },
        keywords: { score: scores.keywordScore, max: 40, matched: matchedKeywords.length, total: jdKeywords.length },
        actionVerbs: { score: scores.actionVerbScore, max: 20, found: foundVerbs },
        length: { score: scores.lengthScore, max: 15, wordCount }
      },
      missingKeywords: missingKeywords.slice(0, 15), // top 15 missing keywords
      matchedKeywords: matchedKeywords.slice(0, 10)  // top 10 matched
    }
  }