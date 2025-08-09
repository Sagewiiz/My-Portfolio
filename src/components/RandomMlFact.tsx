import React from "react";

const FACTS: string[] = [
  "The term 'machine learning' was first coined in 1959 by Arthur Samuel, a pioneer in computer gaming and AI.",
  "Gradient descent dates back to Cauchy in 1847 and is still the workhorse of modern deep learning.",
  "The perceptron, an early neural network model, was introduced by Frank Rosenblatt in 1958.",
  "The 'no free lunch' theorem says no single ML algorithm works best for every problem.",
  "Dropout was proposed in 2014 as a simple yet powerful regularization technique for neural networks.",
  "Word2Vec (2013) popularized efficient neural word embeddings and sparked modern NLP representation learning.",
  "Batch normalization (2015) accelerates training by reducing internal covariate shift in deep nets.",
  "Transformers (2017) removed recurrence and convolution using self‑attention, enabling large‑scale LLMs.",
  "ReLU activations helped deep networks train effectively by mitigating vanishing gradients.",
  "K‑Means was first proposed in the 1950s and remains a widely used clustering algorithm."
];

export default function RandomMlFact() {
  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * FACTS.length));

  const next = () => setIndex((prev) => (prev + 1) % FACTS.length);

  return (
    <div className="my-6 mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold mb-2 text-c-black">Random ML Fact</h2>
      <div className="flex items-start gap-2 p-3 rounded-lg border border-c-300 bg-c-100 shadow-sm">
        <span className="i-ri:lightbulb-line text-xl text-yellow-500 mt-0.5" />
        <div className="flex-1 text-c-700 text-sm">
          {FACTS[index]}
        </div>
        <button
          className="safari-btn w-9 text-c-700"
          title="New fact"
          onClick={next}
          aria-label="New fact"
        >
          <span className="i-ri:refresh-line" />
        </button>
      </div>
    </div>
  );
}


