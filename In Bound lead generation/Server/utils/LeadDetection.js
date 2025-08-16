let classifier = null;

async function loadModel() {
  if (!classifier) {
    const { pipeline } = await import('@xenova/transformers');
    classifier = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');
  }
  return classifier;
}

function hasNegativeWords(comment) {
  const negatives = ['not good', 'bad', 'no interest', "don't want", 'not looking', 'dislike'];
  const lowered = comment.toLowerCase();
  return negatives.some(phrase => lowered.includes(phrase));
}

async function detectBuyingIntent(comment) {
  if (hasNegativeWords(comment)) {
    console.log('🔍 Negative keywords detected, skipping intent');
    return false;
  }

  const candidateLabels = ['buying intent', 'no interest', 'general inquiry'];
  const classifier = await loadModel();

  const result = await classifier(comment, candidateLabels);

  const intentLabel = result.labels[0];
  const confidence = result.scores[0];

  console.log(`🧠 NLP Detected: "${intentLabel}" with confidence ${confidence.toFixed(2)}`);

  return intentLabel === 'buying intent' && confidence > 0.41;
}

module.exports = { detectBuyingIntent };
