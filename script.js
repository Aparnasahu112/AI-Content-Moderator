
const API_KEY = 'AIzaSyA7LX_emf_rdogTDW-mdCtezzwepMXMsFY'; 

const checkButton = document.getElementById('checkButton');
const inputText = document.getElementById('inputText');
const resultDiv = document.getElementById('result');

checkButton.addEventListener('click', () => {
  const text = inputText.value.trim();
  if (text === '') {
    alert('Please enter some text.');
    return;
  }

  resultDiv.innerHTML = 'Checking...';
  resultDiv.classList.remove('hidden');
  resultDiv.classList.add('show');

  moderateText(text);
});

function moderateText(text) {
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

  const data = {
    comment: { text: text },
    languages: ['en'],
    requestedAttributes: { TOXICITY: {}, INSULT: {}, PROFANITY: {} }
  };

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => {
    const scores = json.attributeScores;

    const toxicity = (scores.TOXICITY.summaryScore.value * 100).toFixed(2);
    const insult = (scores.INSULT.summaryScore.value * 100).toFixed(2);
    const profanity = (scores.PROFANITY.summaryScore.value * 100).toFixed(2);

    resultDiv.innerHTML = `
      <h3>Results</h3>
      <p><strong>Toxicity:</strong> ${toxicity}%</p>
      <p><strong>Insult:</strong> ${insult}%</p>
      <p><strong>Profanity:</strong> ${profanity}%</p>
    `;
  })
  .catch(err => {
    console.error(err);
    resultDiv.innerHTML = 'Error checking content.';
  });
}