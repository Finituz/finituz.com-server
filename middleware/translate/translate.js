async function translateText(text, sl = "en", tl = "pt") {
  try {
    const response = await fetch("http://172.17.0.3:5000/translate", {
      // docker translator subnet
      method: "POST",
      body: JSON.stringify({
        q: [text],
        source: "auto",
        target: tl,
        format: "text",
        api_key: "",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok)
      throw new Error("Translation API request failed", response);

    const data = await response.json();
    console.log(data);
    const translatedText = await data["translatedText"];

    if (!translatedText) {
      throw new Error("Can't find translated text.", response);
    }

    console.log("Translated: ", translatedText);
    return String(translatedText);
  } catch (error) {
    console.error("Translation error: ", error);
    return null;
  }
}

module.exports = translateText;
