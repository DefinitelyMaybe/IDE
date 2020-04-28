import { ensureDirSync } from 'https://deno.land/std@v0.41.0/fs/mod.ts'

const decoder = new TextDecoder()
const encoder = new TextEncoder()

function main() {
  
  console.log("main")
  HTMLBuild();
}

async function HTMLBuild() {
  // ensure output folder
  ensureDirSync('./build/html')

  // copy main.ts and compiled graph.ts
  const mainData = Deno.readFileSync("./test/html/main.ts")
  Deno.writeFileSync("./build/html/main.js", mainData)

  const [diag, emit] = await Deno.compile("./test/html/graph.ts")
  
  // // ensuring no diagnostics are returned
  if (diag == null) {
    for (const key in emit) {
      const data = emit[key]
      const name = key.split('/').pop()
      Deno.writeFileSync(`./build/html/${name}`, encoder.encode(data))
    }
  } else {
    console.log("diag1")
    diag.forEach(obj => {
      console.log(obj.message)
    });
  };

  // create html-builder.ts
  const [diag2, emit2] = await Deno.bundle("./src/extensions/html/html-builder.ts")
  
  // ensuring no diagnostics are returned
  if (diag2 == null) {
    Deno.writeFileSync(`./build/html/bundle.htmlbuilder.js`, encoder.encode(emit2))
  } else {
    console.log("diag2")
    diag2.forEach(obj => {
      console.log(obj.message)
    });
  };

  const [diag3, emit3] = await Deno.bundle(
    "./src/test.ts",
    undefined,
    {
      lib: ["dom","esnext"]
    }
  )
  
  // ensuring no diagnostics are returned
  if (diag3 == null) {
    // for (const key in emit3) {
    //   const data = encoder.encode(emit[key])
    //   const name = key.split('/').pop()
    //   Deno.writeFileSync(`./build/${name}`, data)
    // }
    Deno.writeFileSync(`./build/bundle.test.js`, encoder.encode(emit3))
  } else {
    console.log("diag3")
    diag3.forEach(obj => {
      console.log(obj.message)
    });
  };

  // copy .html file from test/html folder to output folder
  const htmlData = Deno.readFileSync("./test/html/index.html")
  Deno.writeFileSync("./build/html/index.html", htmlData)
  
}

// if (import.meta.main) {
//   main()
// }

main()

export {};
