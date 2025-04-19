async function translateText(text, sl = "en", tl = "pt") {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`,
    );

    if (!response.ok) throw new Error("Translation API request failed");

    const data = await response.json();

    // The translated text is in data[0][0][0]
    const translatedText = data[0]?.map((part) => part[0]).join("") ?? "";

    console.log("Translated: ", translatedText);
    return translatedText;
  } catch (error) {
    console.error("Translation error: ", error);
    return null;
  }
}

module.exports = translateText;
