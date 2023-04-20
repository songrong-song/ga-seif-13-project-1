const duration = 1;
const delay = 0.1;

const key1Pattern = [];
for (let i = 0; i < 60; i++) {
  key1Pattern.push({ name: i, duration: 3, delay: 2.6 + i * 1.2 });
}

const key2Pattern = [];
for (let i = 0; i < 60; i++) {
  key2Pattern.push({ name: i, duration: 3, delay: 1.8 + i * 1.52 });
}

const key3Pattern = [];
for (let i = 0; i < 60; i++) {
  key3Pattern.push({ name:i, duration: 3, delay: 2.80 + i * 1.52 });
}


var s = {
  name: 's',
  color:  'rgba(254, 45, 87, 1)',
  next: 0,
  notes: key1Pattern 
};

var space = {
  name: 'space',
  color: 'rgba(28, 121, 228, 1)',
  next: 0,
  notes:key2Pattern 
};

var k = {
    name:'k',
    color: 'rgba(240, 128, 60, 1)',
    next: 0,
    notes: key3Pattern 
  };

var song = {
  duration: 1000*60,
  sheet: [s, space, k]
};
