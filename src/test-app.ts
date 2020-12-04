/**
 * This file is used to test start/watch within nts-scripts itself
 */

const KEEP_ALIVE_SECONDS = 30;

async function main() {
  for (let i = 0; i < KEEP_ALIVE_SECONDS; i++) {
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`${i} second(s)`);
  }
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
