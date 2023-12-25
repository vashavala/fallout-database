import puppeteer from 'puppeteer';

const crawler = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // default timeout 30 sec, set it to 5 min
  page.setDefaultTimeout(60 * 5 * 1000);

  // Navigate the page to a URL
  console.log(`Navigate the page to a URL`)
  const KEYS_URL = 'https://fallout.fandom.com/wiki/Fallout_4_keys'
  const gotoRst = await page.goto(KEYS_URL);

  const keyList = []
  const tbodySelector = `.va-table tbody`
  await page.waitForSelector(tbodySelector);
  const tbodys = await page.$$(tbodySelector)

  if (!tbodys) return;
  for (const tbody of tbodys) {
    const trs = await tbody?.$$(`tr`);
    if (!trs) return;
    trs.shift();
    for (const tr of trs) {
      const nameCell = (await tr?.$(`td:nth-child(2) b`))
      const name = await nameCell?.evaluate(el => el.textContent);
      const idCell = (await tr?.$(`td:last-child span`))
      const id = await idCell?.evaluate(el => el.textContent);
      keyList.push({ id, name })
    }
    console.log(keyList.length)
  }
  console.log(`keyList`, keyList)
  await browser.close();
  return keyList
}
export default async function Page() {
  const keyList = await crawler() || []
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello, KEYS Page!</h1>
      <table>
        <tr>
          <td>ID</td>
          <td>NAME</td>
        </tr>
        {/* {keyList.map(key => (
          <tr key={}>
            <td>{key.id}</td>
            <td>{key.name}</td>
          </tr>
        ))} */}
      </table>
    </main>
  )
}