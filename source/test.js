let a = () => {
    console.log([123].includes(123));
}

global.a = a;
