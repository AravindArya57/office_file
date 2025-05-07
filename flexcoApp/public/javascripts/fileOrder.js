var a = [
    {
        type: 1,
        name: 'video-testing moov',
        url: '',
        uuid: 'da09f14a-c068-4c19-ba76-438d2f563a6b'
    },
    {
        type: 1,
        name: 'video-testing moov',
        url: '',
        uuid: 'da09f14a-c068-4c19-ba76-438d2f563a6b'
    },
    {
        type: 1,
        name: 'youtube testing',
        url: 'https://www.youtube.com/embed/5UlU3BsCGWE',
        uuid: '02796fd8-78b6-4c11-9b8b-ff485fa817c1'
    }
];

var uuids= [ '02796fd8-78b6-4c11-9b8b-ff485fa817c1', "02796fd8-78b6-4c11-9b8b-ff485fa817c", 'da09f14a-c068-4c19-ba76-438d2f563a6b'];

// var b = new Array(10).fill("02796fd8-78b6-4c11-9b8b-ff485fa817c1")

var c=[];


console.countReset('loops')




uuids.forEach(id =>{
  var index = a.findIndex((e)=> e.uuid == id)
  if(index>=0){
  c.push(a[index]);
  a.splice(index, 1)
  }
});

console.log(c)





