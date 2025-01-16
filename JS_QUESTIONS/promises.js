const url = (id) => `https://dummyjson.com/products/${id}`;

async function fetchData(url) {
  try {
    const res = await fetch(url);
    const { price, brand } = await res.json();
    return {
      price,
      brand,
    };
  } catch {
    throw new Error("Failed");
  }
}

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (true) {
            resolve("done !!")
        }
        reject('failed')
   }, 1000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (true) {
            resolve("done !!")
        }
        reject('failed')
   }, 2000)
})

// 1
async function getData() {
//   const d1 = await fetchData(url(1));
//   console.log({ d1 });

//   const d2 = await fetchData(url(2));
//   console.log({ d2 });

   const x =  await Promise.all([p1]).then((d) => {
      console.log(d);
       return d;
    }).catch(e => {
      console.log(e);
  });
    
    console.log("hey ", x);
    const y =  await Promise.all([p2]).then((d) => {
        console.log(d);
         return d;
      }).catch(e => {
        console.log(e);
      });
    
      console.log("hey y", y);
}

getData();
