// to hide google powered by tag -- google translate
// $(window).on('load',  ()=> {
//     $(".goog-logo-link").empty();
//   $('.goog-te-gadget').html($('.goog-te-gadget').children());
// });
window.onload = function()
{ 
var obj = {

"7cbdd902-f064-4972-980b-43d04fe5180a" :
{
	name: "MUKUND KASTHURI",
	number: "+91 9940663923",
	vcf: "Mukund.vcf"
},
"abd8edc0-84d6-46bb-9c7f-3c41fcbc2e42" : 
{
	name: "SIVARAM IYER",
	number: "+91 9840379301",
	vcf: "Sivaram.vcf"
}
};

var url = window.location.href;
var fileID = url.split('/').pop();

var json = JSON.stringify(obj);
document.getElementById('name').innerHTML = obj[fileID].name;
document.getElementById('number').innerHTML = obj[fileID].number;
var ownerId = document.getElementById('ownerId').value;
var saveContactButton = document.getElementById('saveVCF').href = '/images/'+ownerId+'/'+obj[fileID].vcf;
}



