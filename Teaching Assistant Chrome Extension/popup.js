window.addEventListener('load', function(evt){
    document.getElementById('calcHours').addEventListener('submit',calcHours)
});

function getSessionCode(term, code){
var xhttp = new XMLHttpRequest();
var sessionLength="";
var sessionStart=0;
var sessionIndex=0;
var sessionEnd=0;
window.sessionLength=""
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

   	sessionStart= this.responseText.indexOf(code);
   	sessionIndex= this.responseText.indexOf('</td>',sessionStart)+1;
   	// sessionIndex= this.responseText.indexOf('<td>',sessionIndex)+1;
   	sessionIndex= this.responseText.indexOf('</td>',sessionIndex)+1;
    sessionIndex= this.responseText.indexOf('<td>',sessionIndex)+4;
   	sessionEnd=this.responseText.indexOf('</td>',sessionIndex);
   	sessionLength=this.responseText.slice(sessionIndex,sessionEnd);
   	document.getElementById('result').innerText+=sessionLength;
   	ctaHoursPerWeek=(window.registered*window.units)/6.25 
    ctaHoursPerSem=ctaHoursPerWeek*sessionLength
    ctaHoursPerWeek=Math.round(ctaHoursPerWeek*100)/100;
    ctaHoursPerSem=Math.round(ctaHoursPerSem*100)/100;
    if (window.semester==="" || sessionLength===""||window.days===""||window.time===""||window.sectionIndex==-1|| !window.matching){
    	document.getElementById('result').innerText="Error: Please check your input"
    	document.getElementById('result').classList.remove('green')
    	document.getElementById('result').classList.add('red')
    }

    else{
    	document.getElementById('result').classList.remove('red')
    	document.getElementById('result').classList.add('green')
	    document.getElementById('result').innerText="Semester: "+window.semester+"\n";
	    document.getElementById('result').innerText+="Session Length: "+sessionLength+" weeks\n";
	    document.getElementById('result').innerText+="Course: "+window.courseNumber+"\n";
	    document.getElementById('result').innerText+="Section: "+window.sectionNumber+"\n";
	    document.getElementById('result').innerText+="Days: "+window.days+"\n";
	    document.getElementById('result').innerText+="Time: "+window.time+"\n";
	    document.getElementById('result').innerText+="Instructor: "+window.instructor+"\n";
	    document.getElementById('result').innerText+="CTA Hours Per Week: "+ctaHoursPerWeek+" hours per week\n";
	    document.getElementById('result').innerText+="Total CTA Hours for the Semester: "+ctaHoursPerSem +" hours over "+sessionLength +" weeks";
	}	
     //this.responseText
    }
  };
  targetUrl= "https://classes.usc.edu/term-"+term+"/codes/"
  xhttp.open("GET", targetUrl, true);
  xhttp.send();
}

function calcHours(){
	event.preventDefault();
	window.sectionNumber=document.getElementById('sectionNum').value;
	window.courseNumber=document.getElementById('courseNum').value.toUpperCase();
	
  window.sectionIndex=document.getElementById('pageScript').innerText.indexOf('<tr data-section-id="'+sectionNumber+'"');
	registeredSlack='<td class="registered"><!--googleoff: index-->'.length;
	registeredIndex=document.getElementById('pageScript').innerText.indexOf('<td class="registered">',window.sectionIndex)+registeredSlack;
	registeredEnd=  document.getElementById('pageScript').innerText.indexOf(' ',registeredIndex);
	registered=document.getElementById('pageScript').innerText.slice(registeredIndex,registeredEnd);
  if (registered==="<div"){
    registeredSlack+='<div class="closed">'.length
    registeredIndex=document.getElementById('pageScript').innerText.indexOf('<td class="registered">',window.sectionIndex)+registeredSlack;
    registeredEnd=  document.getElementById('pageScript').innerText.indexOf(' ',registeredIndex);
    registered=document.getElementById('pageScript').innerText.slice(registeredIndex,registeredEnd);
  }
  window.registered=parseInt(registered)

  classIndex=document.getElementById('pageScript').innerText.indexOf('<strong>'+window.courseNumber);
  nextClassIndex=document.getElementById('pageScript').innerText.indexOf('<strong>ITP',classIndex+1);
  if(window.sectionIndex>nextClassIndex||window.sectionIndex<classIndex){
  	window.matching=false;
  	console.log(classIndex+" "+nextClassIndex)
  }
  else{
  	window.matching=true;
  }
  unitsSlack='<span class="units">('.length;
  unitsIndex=document.getElementById('pageScript').innerText.indexOf('<span class="units">',classIndex)+unitsSlack;
  unitsEnd= document.getElementById('pageScript').innerText.indexOf(' ', unitsIndex)
  window.units=document.getElementById('pageScript').innerText.slice(unitsIndex,unitsEnd);

  daysSlack='<td class="days">'.length;
  daysIndex=document.getElementById('pageScript').innerText.indexOf('<td class="days">',window.sectionIndex)+daysSlack;
  daysEnd= document.getElementById('pageScript').innerText.indexOf('</td>',daysIndex);
  window.days=document.getElementById('pageScript').innerText.slice(daysIndex,daysEnd);

  timeSlack='<td class="time">'.length;
  timeIndex=document.getElementById('pageScript').innerText.indexOf('<td class="time">',window.sectionIndex)+timeSlack;
  timeEnd= document.getElementById('pageScript').innerText.indexOf('</td>',timeIndex);
  window.time=document.getElementById('pageScript').innerText.slice(timeIndex,timeEnd);

  headerIndex=document.getElementById('pageScript').innerText.indexOf("<h2 data-year");
  semesterStart=document.getElementById('pageScript').innerText.indexOf("<a href=",headerIndex);
  semesterIndex=document.getElementById('pageScript').innerText.indexOf(">",semesterStart)+1;
  semesterEnd= document.getElementById('pageScript').innerText.indexOf('</a>',semesterIndex);
  window.semester=document.getElementById('pageScript').innerText.slice(semesterIndex,semesterEnd);

  instructorStart=document.getElementById('pageScript').innerText.indexOf('<td class="instructor">',window.sectionIndex);
  instructorStop=document.getElementById('pageScript').innerText.indexOf('</td>',instructorStart);
  aIndex= document.getElementById('pageScript').innerText.indexOf('<a href=',instructorStart);
  if(aIndex<instructorStop){
    instructorIndex=document.getElementById('pageScript').innerText.indexOf('>',aIndex)+1;
    instructorEnd= document.getElementById('pageScript').innerText.indexOf('</a>',instructorIndex);
  }
  else{
    instructorSlack='<td class="instructor">'.length;
    instructorIndex=instructorStart+instructorSlack;
    instructorEnd=instructorStop;
  }
  window.instructor=document.getElementById('pageScript').innerText.slice(instructorIndex,instructorEnd);
  if(window.instructor ===''){
    window.instructor = 'None'
  }
  
  var termElements=semester.split(" ");
  var termCode="";
  var term="";
  if(termElements[0]==="Spring"){
  	termCode="1";
  }
  if(termElements[0]==="Summer"){
  	termCode="2";
  }
  if(termElements[0]==="Fall"){
  	termCode="3";
  }
  codeStart= document.getElementById('pageScript').innerText.indexOf('<a class="lightbox"', window.sectionIndex);
  codeIndex= document.getElementById('pageScript').innerText.indexOf('>', codeStart)+1;
  codeEnd=document.getElementById('pageScript').innerText.indexOf('</a>', codeIndex);
  code= document.getElementById('pageScript').innerText.slice(codeIndex,codeEnd);

  term= termElements[1]+termCode;
  getSessionCode(term,code);


  // ctaHoursPerWeek=(registered*units)/6.25 
  // ctaHoursPerSem=ctaHoursPerWeek*17//17 = course length
  // ctaHoursPerWeek=Math.round(ctaHoursPerWeek*100)/100;
  // ctaHoursPerSem=Math.round(ctaHoursPerSem*100)/100;
  // document.getElementById('result').innerText="Semester: "+semester+"\n";
  // document.getElementById('result').innerText+="Course: "+courseNumber+"\n";
  // document.getElementById('result').innerText+="Section: "+sectionNumber+"\n";
  // document.getElementById('result').innerText+="Days: "+days+"\n";
  // document.getElementById('result').innerText+="Time: "+time+"\n";
  // document.getElementById('result').innerText+="Instructor: "+instructor+"\n";
  // document.getElementById('result').innerText+="CTA Hours Per Week: "+ctaHoursPerWeek+" hours per week\n";
  // document.getElementById('result').innerText+="Total CTA Hours for the Semester: "+ctaHoursPerSem +" hours over 17 weeks";
  
}
chrome.runtime.onMessage.addListener(function(request, sender) {
  var message = document.querySelector('#pageScript');
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

function onWindowLoad() {

  var message = document.querySelector('#pageScript');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;

