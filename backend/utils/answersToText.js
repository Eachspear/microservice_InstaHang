export const answersToText = (answers) => {
  const questions = [
    "I see myself as someone who is talkative.",
    "I tend to be quiet and reserved.",
    "I get stressed out easily.",
    "I am relaxed most of the time.",
    "I have a vivid imagination.",
    "I am original and come up with new ideas.",
    "I am dependable and self-disciplined.",
    "I tend to be lazy.",
    "I am considerate and kind to almost everyone.",
    "I am sometimes rude to others."
  ];

  let description = "The user describes themselves as someone who ";
  const traits = [];

  answers.forEach((score, idx) => {
    if (score >= 4)
      traits.push(`strongly agrees that "${questions[idx]}"`);
    else if (score === 3)
      traits.push(`is neutral about "${questions[idx]}"`);
    else
      traits.push(`disagrees that "${questions[idx]}"`);
  });

  return description + traits.join(", ") + ".";
};
