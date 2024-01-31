// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updateMegillahUrls() {
  const urls = [
    {
      name: "100",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/100E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=b4TtnBFvEX0Z0%2F2ow98UtVChHk9GCdA78AwThay5TjyQZ9TD9Bwp2xsk87rKMzrIfh5NCTcF7U6sYr5LHPnc68AF%2FRcDgzLmQxPx79w5NZlnGjA%2F7qSRC%2BHhsGlC2JX9asXD3Bi7cAi5SsljkOn2vF4UIxxnQdVi1DP%2BWquErxT72LrujgpEJyQU4ibXb%2F%2FVzFbibm%2BP4vb%2FPWQVDQCs7Cymd%2BoDvqOHcTgAYgBo2zz7ltU%2FE2gztsaFCQCvCQl5gPal7%2Fzc04PK7EIiRWW3Judk5c8hf32yzi3T3dk1i2AZ37C94mkssyf6z55EYKfSELjFQ6cOrO28fUeCKxTBMQ%3D%3D",
    },
    {
      name: "101",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/101E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=JuvBTrdfazsSabJtjjlM2zsUjdGaQaVbhUEU0GjIEPIwn6%2F%2Bi%2BZLGjYU9eAwCrsx5pgUIIOIfbcGBDFmDJhw2eYgvvDNhLw1Xns3aKP1UEL3OvQVDdiMf2wOgiQp6kVeVisTxMMT9gLOEYzj9uH6u%2F66%2Bezf6ZcAP9rzWYz1%2BEFJJCORB2kKi%2FvxlbpXIYIC%2BfQWCidmTKUZC0S0sYTo5fxYH3LG0l3GuAjyX63BfCdS%2BvDsVuEhLESpFISt595fOMaCOHnav%2FOgsG70vmYJYZwJ6QBxhnsWvksU18gsTNVigZFsfYD8vdmKBp28tljcC9R%2BNQYpUiI3Nb7UgvC4Ww%3D%3D",
    },
    {
      name: "102",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/102E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=nP4nWYWwGgUleTPlXjN2GgpL%2BTHpN5yjSkxzAoiFC%2FM1lw6y%2BqypBkEuy3W6ImzGHEwVYkNJ2gHAD%2BhHb6xJLq8V4rDWNeJBmbsZxQS2ldO3Gwawvxn9VaCSREoiNgP1xDFbFxM%2Fjq5ukJi5Ms9GbU6gh0LA1UFUI%2BpEL6W0Gt4xQB8MCA0HxdMgn6yFkndybDvyCtPniQ3Xejrrjc2NOU1QY1MT4CTnH%2FF3uzLDUVrDnn%2FYzHCZ06wEbsJa1h0Tbg4McZ94I1yf94Z4bWp3%2BaJahacO11frKbuy%2B5hmMx2SZx0%2Fw44iyIhQUx2etchqR5skny%2FRTYIlLVdCiBSEDA%3D%3D",
    },
    {
      name: "103",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/103E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=D7RxT6OjFAIs6h8%2FfNOM0MvkEabu83OWE4NxgXabuWkwpTvhSqXltgPh6bVFGSAuXfsn75aJl%2BLtTP7FS4TbOB4%2BOXGBkwWEoh3uiyCD%2Fmnk8vcQbnu47Az%2F7patPkOaS4oxpe34tmANlhgKGjBhaRHgITGk25iZlnMyEbt5J69G8vNHcqmVCW%2Fysx25cc4yLxXLaEfCsGaqlAGKQQlnYxg29XHXZzlL0j8nC3eFvsG9vpWYIFdHiRUy9a8z5hVnTjWun61ZS76zCqLSrmSHaZ%2FrcClUu6x6YPTc5aMmN9mH5GG9HWDwaK3TCFO%2BKVH%2BEx5n0l%2FBelBfn9dQXy8BaQ%3D%3D",
    },
    {
      name: "91",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/91E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=tis6G0bb1Vo8fXcB4MqhEIGHayP%2FpJNDhUOEgPi3iu%2F%2Bo6xoqRqkOHBGe5rLx9Is7hkiQ%2F2IvibOpwTYxBXbLcFsKlIoRd5f03MSRddq2d73%2BxkWJ%2F6uXvrWgrNzudtZVTxgT0L3QF02Xord2XzjLXFBnKPGPti5%2BuDucgd%2ByQA1jUwKWwmuOdWSWQF6xZnjiAGWfwMd%2Fx7vxboMcao4EPEXPqYixxzH1qremMhRM%2F1u9B7wrrcFZSZJw4zGeungD0CzgLnvoB0dv4nmlSiE1BQhoxtQPa1XQaABPZ4JkgWfrSDiGalVgb82IPBe0zFEw4go3x6Suqsa9tZ1A1bvag%3D%3D",
    },
    {
      name: "92",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/92E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=e4uvDQUYv%2FwKjpzychhRTl4bP0XwIvskJLRjFpeMh2d6BKpNxiV9zjbzRipj0d0jNeTDWtAx16JRz44nMszBeB%2BUyiqYOEEyJqGUYgUe0qIq3wi0gFuCW5HkNVlNStQ8eP4xSahjemILUwWp6FT3wnZ7jMw6oW1D5IoAqHNExcGLPfxtY8dGF836KfBGCL12fnS1PoQgDwF46d%2BN3XRFHZGXTGXJ%2Bq%2F2rudmJkRwACOs8iliRhuJzK4XvPyPu00FrhGe9japHCSAaHDc%2FB6HTUNtuceRkvNlr40Eh%2F%2FzStIrcXgy3BfIONLBuz5QzlJ3AzeiBfIrW2Cx952N5ZagNw%3D%3D",
    },
    {
      name: "93",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/93E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=pIMQg0Jewcrsj5zo4iQCJLDCw4RFD9Y6GAqWMy9eZZTgNbU7XkMKUmXuf2wZj5WalceO1C5O7yzGXL2Ab0gZdbXHdg0x5sKePjN9cBxvFdVo3Q753%2FepHsqItxzZ%2BggKt%2BBWGh08Ypb3RrkyP2vMoizHswln4V%2BbAIqpUHYPT0zm%2FGUaHO%2F8ndVsOpXDINvQ%2FYaETmv9Y%2BUgSBM3iR8DAjO7msbpIqHTC%2FY%2Fbye33H0A%2F1jDxGyQmLUhVoFILCYUS8lw4psGunBOuaBEM7F%2FixXi64s%2BY5Pp0am2BuAtV1wwaWyFdKpf70teMD7BrwRJYdkxyTXp1T9Z9ckQTRJ7ew%3D%3D",
    },
    {
      name: "94",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/94E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=BFa%2Fvq%2BJQlQBHtwBpAUK6J4Cw2Owk64%2F8LZs3yfpCKVL6v29Pu14%2FkhqjIdAbjuCPhmkWOiKnj0Ug%2Fszou1KRp9wS6PFGgzoXMSEfBaI2EPSh19AuPqLhDgOMgaiKcJHURzAiMC5Dyh%2FMPWOLxlwu6AzDdhkWc0LAQfsUwvjnzp7dSHGcK3ynnRLydSZggK3aFdOLFdiIf%2Bvwp66DvuTXnikgzw0aLXQr9RZi7%2BdkBEGO95H3V3TXTbB7RqgmZhUT53m%2BqJtq%2BwqaxJ9QYEQq8dwKdaM6AjSbyO2hZFn%2Byv8lNW1jLtMQRDQHeHkzWngskNe718ZgzJiPyXESFHhwA%3D%3D",
    },
    {
      name: "95",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/95E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=kxaTGZsHe7qHsALwbFixWe1lCy7uWxdgF%2BY0gAGKKiLwtt2Mb78iCE67wTYIL6h5klgJLOWMOSWKKqSRf3z4HJ6n0CWxTe%2BH8M9HnFKICMp9Zt76f1G8lKoTEOGDnTob6xshSTNGkp3wqySJQKlREtSKZhO%2B6xhDPTVHYqAo8BOXbm8Zx%2BXMkZhJ%2Fi%2B3QLc33iQTy%2BpaKoMIFDwphveJtl4R2yyGvcTh7PczWRbXnmdznSzTRxThJV%2FT%2BVnKpI8ka%2F%2BuuTNNfV8vqKossULEYi2FANzEsBYjRfTrCExwnyk8zS6jPTq2FZoua3Czoa9VpW3U9nYDBBr5M%2BfB5YqsRg%3D%3D",
    },
    {
      name: "95",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/95F.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Paz0v2RvUZwqj5jr5qq%2BhLfZqWOOc%2FqI1XFjSSSMN4E%2FDH8yaii3EXyCUEHFycEPJhewxkOKNAn9C4EGYvQRQrR4dawQrbGqg8Hr1oVmsUYvui0GiP9VQxN%2Besy1RPTGyEx0AB31m3lWPTUYc5sxasdHnlP5RTzCYsEbCUvGfV8dkte%2FOBrLr5bhjfhvKLolCppFdY%2Fwwc3fidCxF3Yjmsh0ZACYJqWGovVxMY3g4j7la0EYcqFJDFrU9Cncl4mz1D6BpCezRc3QcEP01CtTH5Z%2FBVuQ8FxJ20RoeAGdY6%2F6oU5zeBjBwnfanj9SnDessbANAuSXfjLUs%2BLw%2BY%2Fv5A%3D%3D",
    },
    {
      name: "96",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/96E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=kCMFkK9AmC5zL%2BiV%2B%2ByseU9ykuVp2yuJvc4LiJZPeHsYLgsnqjETa4eZP5wYiRx6JUZu9OuVfwg3C8CHi888NJ6%2BmWbNmAr%2FJtd3GDqFeFnASwj7MiWXA4yC34Dbb9B33k6UtwVxRy%2BL1cyt4utSpcckKXL0CnypjjEnkv0RLktNvT3Iz1hlmamwSqLN3xGRgISiXfyWGVYoJ2BYJ9KqM9x0PxN3M8rubyZwzVyphzko1wNW5rN8q57Lole4uwu3b8K6z6q%2FEbuKY2XA9K5RPhfWDBjKMlK77qt0D6MpT%2FMLzdFiVF6fwTz3q7TZraUqKxZBknVClCg3e8X74Gf99A%3D%3D",
    },
    {
      name: "97",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/97E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=GPmc1cej6T1ej6OMPyNJubdhpoKf0CMmU10FM5B11uToaKO9FnfkQlxuNcehYRYkqvgsapI1XJnwtJpXCR29bm0Qo718IzvBZjiA0%2Bd8sB0XQkQeyRItPnVp%2FTwdMSqYf%2BqgefE%2Fzun3tSczK8x2EYNinMkxwalYFGbjwLCN8wo6S6RgZcbzhx5dUulSImSf2Aa%2BTvQfQL9obazV2DYykPLr3SRt9FLYLe%2BvSqxcfrmYnE%2F0lgEkNwhOHPzUQKcYx3yIown%2F2XTbLoIAhDu3I%2F42fbusu1OvyFEeddZeISJEN0SyIyVzz2GCCr1kc4FBGCf%2BQqn%2BrvUabCZr%2B8KQsA%3D%3D",
    },
    {
      name: "98",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/98E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=K6%2B4C1QjCo52%2BAX8Fe7%2F%2BlYkHIvFW8RLDFo4KO1brZ9r5P8VUuvynoUiji6XI6BoqaWRUc%2FhI5V2zOEGI9akmknXD%2BQGyu23ARYKO1N%2FYU9DUMV49c5ESRPesfLm1Vjc1olaIcSoIvJ%2FcE1SQPf4xTRnp4lAUTj5RihnZBTe3Qbe3eTXXaucMrWSNOtbZsbF2a2FC9c1cN61NQp1u%2FHhgbRRUnpIjKs0bDX7IPg55uY7wW%2BP1y8zBF%2Bxc%2Br4HCUZq0Gl13b5sSSlU7abDClfh4sQB4ednapn668K9Y5PIRbt9MowY1gx6r%2FnHMfPxcZdB1I31oXKmhZORIEvZBY8Lw%3D%3D",
    },
    {
      name: "99",
      url: "https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/99E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=vGJjyzBUR599kmsDksQfngYcqUnVYfNHBWKm%2BUXFfV0lzj0fpGADWmTmNd2F2CmyAJ8%2B7n4miN9eq4X0OO5l%2BU1J%2FrdVwNyvDrCcMyCFcbTuJIqPnRshbQAX6kslINX6qawCCUP6l%2FRkmaeBiQLUVIHwlrzVAi5Y2urLe9aiW9VT43diJvs6t02rwBvApX76mn677oCKUbySBlnAXTd8nUmyk6lXY04LDCGk0rFuF31aBhE5gASh7GMBaSPKGjAz25fg7z8b5fN%2BAAXyNd1a8iEEsGR8F%2F86MiOICoZmdATm5NHc4QGWZtBV7uu1E6gs8KhiOeILZDvgAwL3JL26oQ%3D%3D",
    },
  ];

  for (const item of urls) {
    if (item.name !== null) {
      await prisma.megillah.updateMany({
        where: {
          // Assuming 'name' is a field in your Megillah model
          issue: Number(item.name),
        },
        data: {
          url: item.url,
        },
      });
    }
  }

  console.log("Update complete");
}

updateMegillahUrls().catch((e) => {
  throw e;
});
