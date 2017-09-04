/* global var, the content which need to be readed, and i which article is reading and j which answer is reading */
var content = null;
var i = 0;
var j = 0;
var status = "";

/* function play, send page_type to content js and speak return content */
function play(){
  chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
    var page_type = urlVerification(tabs[0].url);
    if(page_type != "Not_Verificated"){
      chrome.tabs.sendMessage(tabs[0].id, {'page_type': page_type}, function(response){
        content = response;
        i = 0;
        j = 0;
        start();
      });
    }else{
      chrome.tts.speak("不支持朗读此页面，请打开知乎首页、问答页、专栏页、收藏页或话题页后，再点击开始朗读");
    }
  });
}

function speak(){
  var article = content[i];
  if(article.title == ""){
    next();
  }else{
    chrome.tts.speak(
      article.title + article.description,
      {
        onEvent: function(event){
          if(event.type == 'end'){
            speakAnswer();
          }
        }
    });
  }
}

function speakAnswer(){
  var answer = content[i].answers[j];
  if(answer.answer_detail == ""){
    next();
  }else{
    chrome.tts.speak(
      answer.username + answer.vote_number + answer.answer_detail,
      {
        onEvent: function(event){
          if(event.type == 'end'){
            j = j + 1;
            if(j<content[i].answers.length){
              speakAnswer();
            }else{
              next();
            }
          }
        }
    });
  }
}

function speakNextArticle(){
  i = i + 1;
  j = 0;
  if(i < content.length){
    speak();
  }else{
    //if i runs content.length, speak has finished, reset user view and global vars
    stop();
  }
}

function speakPreArticle(){
  i = i - 1;
  j = 0;
  if(i >= 0){
    speak();
  }else{
    i = 0;
    speak();
  }
}

function start(){
  speak();
  chrome.extension.getViews({'type': 'popup'})[0].buildPauseView();
}

function pause(){
  chrome.tts.pause();
  chrome.extension.getViews({'type': 'popup'})[0].buildResumeView();
}

function resume(){
  chrome.tts.resume();
  chrome.extension.getViews({'type': 'popup'})[0].buildPauseView();
}

function stop(){
  chrome.tts.stop();

  var popup_page = chrome.extension.getViews({'type': 'popup'})[0];
  if(popup_page){
    popup_page.buildPlayView();
  }else{
    status = "play";
  }
  i = 0;
  j = 0;
}

function next(){
  i = i + 1;
  j = 0;
  if(i < content.length){
    speak();

    var popup_page = chrome.extension.getViews({'type': 'popup'})[0];
    if(popup_page){
      popup_page.buildPauseView();
    }else{
      status = "pause";
    }
  }else{
    //if i runs content.length, speak has finished, reset user view and global vars
    stop();
  }
}

function pre(){
  i = i - 1;
  j = 0;
  if(i >= 0){
    speak();
  }else{
    i = 0;
    speak();
  }

  chrome.extension.getViews({'type': 'popup'})[0].buildPauseView();
}

/* Verificate current url, make correct content function call */
function urlVerification(url){
  if((new RegExp("^(https|http)://www\.zhihu\.com/*$")).test(url)){
    return "Home_Feed";
  }else if((new RegExp("^(https|http)://www\.zhihu\.com/question/[0-9]+/answer/[0-9]+$")).test(url)){
    return "Answer";
  }else if((new RegExp("^(https|http)://www\.zhihu\.com/question/[0-9]+$")).test(url)){
    return "Question";
  }else if((new RegExp("^(https|http)://www\.zhihu\.com/collection/[0-9]+$")).test(url)){
    return "Collection";
  }else if((new RegExp("^(https|http)://www\.zhihu\.com/topic/[0-9]+/(hot|top-answers|newest)$")).test(url) || (new RegExp("^(https|http)://www\.zhihu\.com/topic#*.*$")).test(url)){
    return "Topic_Feed";
  }else if((new RegExp("^(https|http)://zhuanlan\.zhihu\.com/p/[0-9]+$")).test(url)){
    return "Columnist";
  }else if((new RegExp("^(https|http)://www\.zhihu\.com/explore(#daily-hot|#monthly-hot)*$")).test(url)){
    return "Explore_Feed";
  }else {
    return "Not_Verificated";
  }
}
