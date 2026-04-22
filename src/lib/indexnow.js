const INDEXNOW_KEY = "4f980b4565674e50a4fe43b22b8dd8ac";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * Submits URLs to IndexNow (Bing, Yandex, etc.)
 * @param {string[]} urlList - List of full URLs to index
 */
export async function submitToIndexNow(urlList) {
  if (!urlList || urlList.length === 0) return;

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.intrusionscope.site').replace(/\/$/, '');
  const host = new URL(baseUrl).hostname;

  const payload = {
    host: host,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.map(url => url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`)
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`IndexNow: Successfully submitted ${urlList.length} URLs.`);
    } else {
      const errorText = await response.text();
      console.error(`IndexNow Error (${response.status}):`, errorText);
    }
  } catch (error) {
    console.error("IndexNow Submission failed:", error);
  }
}
