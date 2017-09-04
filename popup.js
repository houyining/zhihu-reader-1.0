document.addEventListener("DOMContentLoaded", function(){
  var status = chrome.extension.getBackgroundPage().status;

  if(status == "pause"){
    buildPauseView();
  }else if(status == "resume"){
    buildResumeView();
  }else{
    buildPlayView();
  }
});

function buildPlayView(){
  var wrapper_html = "<h1>知乎朗读</h1><p id='article_title'>首页 / 问答 / 专栏 / 收藏 / 话题</p><div id='voice_wave'>";

  for(var i=0; i<13; i++){
    wrapper_html += "<div class='bar'></div>";
  }

  wrapper_html += "</div><button id='str_btn'><i class='iconfont icon-ic_play_arrow_px'></i></button>";
  document.getElementById("wrapper").innerHTML = wrapper_html;

  document.getElementById("str_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().play();
  });
  chrome.extension.getBackgroundPage().status = "play";
}

function buildPauseView(){
  var bg_page = chrome.extension.getBackgroundPage();

  var wrapper_html = "<h1>知乎朗读</h1><p id='article_title'>";
  if(bg_page.content[bg_page.i].title){
    wrapper_html += bg_page.content[bg_page.i].title;
  }

  wrapper_html += "</p><div id='voice_wave'>";

  for(var i=0; i<13; i++){
    wrapper_html += "<div class='bar wave'></div>";
  }

  wrapper_html += "</div>";

  var i = bg_page.i;
  var length = bg_page.content.length;
  if(i == 0){
    wrapper_html += "<button class='small_btn' id='pre_btn' disabled><i class='iconfont icon-ic_skip_previous_px'></i></button>";
  }else{
    wrapper_html += "<button class='small_btn' id='pre_btn'><i class='iconfont icon-ic_skip_previous_px'></i></button>";
  }

  wrapper_html += "<button class='small_btn' id='pause_btn'><i class='iconfont icon-ic_pause_px'></i></button>";

  if(i == length-1){
    wrapper_html += "<button class='small_btn' id='next_btn' disabled><i class='iconfont icon-ic_skip_next_px'></i></button>"
  }else{
    wrapper_html += "<button class='small_btn' id='next_btn'><i class='iconfont icon-ic_skip_next_px'></i></button>"
  }

  wrapper_html += "<button class='small_btn' id='stop_btn'><i class='iconfont icon-jieshu'></i></button>";

  document.getElementById("wrapper").innerHTML = wrapper_html;

  document.getElementById("pause_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().pause();
  });
  document.getElementById("stop_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().stop();
  });
  document.getElementById("next_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().next();
  });
  document.getElementById("pre_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().pre();
  });

  chrome.extension.getBackgroundPage().status = "pause";
}

function buildResumeView(){
  var bg_page = chrome.extension.getBackgroundPage();

  var wrapper_html = "<h1>知乎朗读</h1><p id='article_title'>";
  if(bg_page.content[bg_page.i].title){
    wrapper_html += bg_page.content[bg_page.i].title;
  }

  wrapper_html += "</p><div id='voice_wave'>";

  for(var i=0; i<13; i++){
    wrapper_html += "<div class='bar'></div>";
  }

  wrapper_html += "</div>";

  var i = bg_page.i;
  var length = bg_page.content.length;
  if(i == 0){
    wrapper_html += "<button class='small_btn' id='pre_btn' disabled><i class='iconfont icon-ic_skip_previous_px'></i></button>";
  }else{
    wrapper_html += "<button class='small_btn' id='pre_btn'><i class='iconfont icon-ic_skip_previous_px'></i></button>";
  }

  wrapper_html += "<button class='small_btn' id='resume_btn'><i class='iconfont icon-ic_play_arrow_px'></i></button>";

  if(i == length-1){
    wrapper_html += "<button class='small_btn' id='next_btn' disabled><i class='iconfont icon-ic_skip_next_px'></i></button>"
  }else{
    wrapper_html += "<button class='small_btn' id='next_btn'><i class='iconfont icon-ic_skip_next_px'></i></button>"
  }

  wrapper_html += "<button class='small_btn' id='stop_btn'><i class='iconfont icon-jieshu'></i></button>";

  document.getElementById("wrapper").innerHTML = wrapper_html;

  document.getElementById("resume_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().resume();
  });
  document.getElementById("stop_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().stop();
  });
  document.getElementById("next_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().next();
  });
  document.getElementById("pre_btn").addEventListener("click", function(){
    chrome.extension.getBackgroundPage().pre();
  });
  chrome.extension.getBackgroundPage().status = "resume";
}
