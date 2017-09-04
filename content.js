chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  sendResponse(getReadContent(message.page_type));
});

function getReadContent(page_type){
  switch(page_type){
    case "Home_Feed":
      return getContentFromHomeFeed();
    case "Topic_Feed":
      return getContentFromTopicFeed();
    case "Collection":
      return getContentFromCollection();
    case "Question":
      return getContentFromQuestion();
    case "Answer":
      return getContentFromAnswer();
    case "Columnist":
      return getContentFromColumnist();
    case "Explore_Feed":
      return getContentFromExploreFeed();
  }
}

function getContentFromAnswer(){
  try{
    var title = parseContent(document, ["#zh-question-title"]);
    var description = parseContent(document, ["#zh-question-detail"]);

    var answer_wrap_dom = document.getElementById("zh-question-answer-wrap");
    if(answer_wrap_dom){
      var username = parseContent(answer_wrap_dom, ["a.author-link","span.name"]);
      var vote_number = parseContent(answer_wrap_dom, ["div.answer-head span.voters"]);
      var answer_detail = parseContent(answer_wrap_dom, ["div.zm-editable-content"]);

      var answers = new Array(new answer(username, vote_number, answer_detail));

      return new Array(new article(title, description, answers));
    }else{
      return new Array(new article("内容为空", "", new Array(new answer("","", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function getContentFromColumnist(){
  try{
    var title = parseContent(document, ["h1.entry-title"]);

    var username = parseContent(document, ["div.entry-meta > a"]);
    var answer_detail = parseContent(document, ["section.entry-content"]);

    var answers = new Array(new answer(username, "", answer_detail));
    var content = new Array(new article(title, "", answers));

    return content;
  }catch(err){
    console.log(err);
  }
}

function getContentFromHomeFeed(){
  try{
    var feedlist = document.querySelectorAll("div.feed-item");
    if(feedlist){
      var content = new Array();
      for(var i =0; i<feedlist.length; i++){
        var feed_dom = feedlist[i];
        var title = parseContent(feed_dom, ["h2.feed-title"]);

        var username = parseContent(feed_dom, ["div.feed-content a.author-link", "div.feed-content span.name"]);
        var vote_number = parseContent(feed_dom, ["div.entry-body span.voters"]);
        var answer_detail = parseContent(feed_dom, [".content"]);

        content.push(new article(title, "", new Array(new answer(username, vote_number, answer_detail))));
      }
      return content;
    }else{
      return new Array(new article("内容为空", "", new Array(new answer("", "", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function getContentFromTopicFeed(){
  try{
    var feedlist = document.querySelectorAll("div.feed-item");
    if(feedlist){
      var content = new Array();
      for(var i =0; i<feedlist.length; i++){
        var feed_dom = feedlist[i];
        var title = parseContent(feed_dom, ["h2 a.question_link"]);

        var username = parseContent(feed_dom, ["a.author-link", "span.name"]);
        var vote_number = parseContent(feed_dom, ["div.entry-body span.voters"]);
        var answer_detail = parseContent(feed_dom, [".content"]);

        content.push(new article(title, "", new Array(new answer(username, vote_number, answer_detail))));
      }
      return content;
    }else{
      return new Array(new article("内容为空", "", new Array(new answer("", "", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function getContentFromExploreFeed(){
  try{
    var feedlist = document.querySelectorAll("#js-explore-tab div[style*='display: block'] div.explore-feed");
    if(feedlist){
      var content = new Array();
      for(var i =0; i<feedlist.length; i++){
        var feed_dom = feedlist[i];
        var title = parseContent(feed_dom, ["h2 a.question_link"]);

        var username = parseContent(feed_dom, ["a.author-link", "span.name"]);
        var vote_number = parseContent(feed_dom, ["div.answer-head span.voters"]);
        var answer_detail = parseContent(feed_dom, [".content"]);

        content.push(new article(title, "", new Array(new answer(username, vote_number, answer_detail))));
      }
      return content;
    }else{
      return new Array(new article("内容为空", "", new Array(new answer("", "", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function getContentFromCollection(){
  try{
    var feedlist = document.querySelectorAll("div.zm-item");
    if(feedlist){
      var content = new Array();
      for(var i =0; i<feedlist.length; i++){
        var feed_dom = feedlist[i];
        var title = parseContent(feed_dom, ["h2.zm-item-title"]);

        var username = parseContent(feed_dom, ["a.author-link", "span.name"]);
        var vote_number = parseContent(feed_dom, ["div.answer-head span.voters", "div.post-head span.voters"]);
        var answer_detail = parseContent(feed_dom, [".content"]);

        content.push(new article(title, "", new Array(new answer(username, vote_number, answer_detail))));
      }
      return content;
    }else{
      return new Array(new article("内容为空", "", new Array(new answer("", "", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function getContentFromQuestion(){
  try{
    var title = parseContent(document, ["#zh-question-title"]);
    var description = parseContent(document, ["#zh-question-detail"]);

    var answerlist = document.querySelectorAll(".zm-item-answer");
    if(answerlist){
      var answers = new Array();
      for(var i=0; i<answerlist.length; i++){
        var answer_dom = answerlist[i];

        var username = parseContent(answer_dom, ["a.author-link", "span.name"]);
        var vote_number = parseContent(answer_dom, ["div.answer-head span.voters"]);
        var answer_detail = parseContent(answer_dom, ["div.zm-editable-content"]);

        answers.push(new answer(username, vote_number, answer_detail));
      }
      return new Array(new article(title, description, answers));
    }else{
      return new Array(new article(title, description, new Array(new answer("", "", ""))));
    }
  }catch(err){
    console.log(err);
  }
}

function parseContent(element, query_array){
  for(var i=0; i<query_array.length; i++){
    var ele = element.querySelector(query_array[i]);
    if(ele){
      return ele.textContent;
    }
  }
  return "";
}

function answer(username, vote_number, answer_detail){
  this.username = formatter(username);
  this.vote_number = formatter(vote_number);
  this.answer_detail = formatter(answer_detail);
}

function article(title, description, answers){
  this.title = formatter(title);
  this.description = formatter(description);
  this.answers = answers;
}

function formatter(str){
  return str.replace(/\r|\n|\r\n|<[^>]*>/g, "");
}
