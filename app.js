var is_playing, startTime, score_recorder, maxcombo, speed, multiplier

initialize_variables = ()=> {
  is_playing = false;
  startTime;
  score_recorder = {
    perfect: 0,
    good: 0,
    bad: 0,
    miss: 0,
    combo2: 0,
    combo4: 0
  }
  
  maxcombo = 0;
  speed = 1;

  multiplier = {
    perfect: 1,
    good: 0.8,
    bad: 0.5,
    miss: 0,
    combo2: 1.05,
    combo4: 1.10
  };

}


const initialize_layout = () => {

  /////////////////////////////
  /////////////////////////////
  ///generate HTML skeletons///
  /////////////////////////////
  /////////////////////////////


  //////////////////////////////////////////
  /////////////right - menu/////////////////
  //////////////////////////////////////////

  //step one: generate container for game and menu
  $(".container").append($("<div>").addClass("game").addClass("half"));
  $(".container").append($("<div>").addClass("menu").addClass("half"));

  //step two: container for the menu
  // 0. music
  $(".menu").append($("<audio>").attr('src', 'Lilac For Anabel.mp3').attr('id', "LILAC"));

  // 1. Repo
  $(".menu").append($("<a>").attr('id', "repo").addClass("menu_element"));
  $("#repo").text("Github Repo")
  $("#repo").attr('href', 'https://github.com/songrong-song/songrong-song.github.io')

  // 2. Title
  $(".menu").append($("<h1>").attr('id', "title").addClass("menu_element"));
  $("#title").text("Rhythm Game")

  // 2. Title
  $(".menu").append($("<h1>").attr('id', "music_name").addClass("menu_element"));
  $("#music_name").text("LILAC FOR ANABEL")

  // 3. Profile Pic
  $(".menu").append($("<img>").attr('id', "profile_image").addClass("menu_element"));
  $("#profile_image").attr("src", "Lilac_for_Anabel.png")
  $("#profile_image").attr("alt", "LILAC FOR ANABEL")

  //4. Composer
  $(".menu").append($("<p>").attr('id', "composer").addClass("menu_element"));
  $("#composer").append('<span class="heart">&#x2764;</span>Original song composed by <span class="heart">&#x2764;</span><span>CYTUSII</span>');

  //4. Speed Buttons
  $(".menu").append($("<div>").addClass("menu_element").addClass("speed_selector"));
  $(".speed_selector").append($("<h3>").text("SPEED").attr('id', "speed"))
  $(".speed_selector").append($("<div>").addClass("speed_button"));
  $(".speed_button").append($("<a>").text("1x").addClass("speed_button_element"))
  $(".speed_button").append($("<a>").text("2x").addClass("speed_button_element"))
  $(".speed_button").append($("<a>").text("3x").addClass("speed_button_element"))

  //4. Start Buttons
  $(".menu").append($("<a>").addClass("menu_element").attr("id", "start").text("start"));

  //5. Score Display
  $(".menu").append($("<div>").addClass("menu_element").attr("id", "score_display"));

  //6. Result Menu
  $(".menu").append($("<div>").addClass("menu_element").attr("id", "result_menu"));

  //////////////////////////////////////////
  /////////////left - menu//////////////////
  //////////////////////////////////////////
  const key = ['s', 'space', 'k'];
  //1. track 
  $(".game").append($("<div>").addClass("game_element").addClass("track_container"));
  for (let i = 0; i < key.length; i++) {
    $(".track_container").append($("<div>").addClass("track").attr('id', "track" + key[i]))
  }

  //2. key press
  $(".game").append($("<div>").addClass("game_element").addClass("key_press_container"));
  for (let i = 0; i < key.length; i++) {
    $(".key_press_container").append($("<div>").addClass("hidden").addClass("key_press").attr('id', 'keypress' + key[i]));
  }

  //3. key 
  $(".game").append($("<div>").addClass("game_element").addClass("key_container"));
  for (let i = 0; i < key.length; i++) {
    $(".key_container").append($("<div>").addClass("key").attr('id', 'key' + key[i]).text(key[i]))
  }

  //4. score section
  $(".game").append($("<div>").addClass("game_element").addClass("score_container"));

  //5. combo section
  $(".game").append($("<div>").addClass("game_element").addClass("combo_container"));
}

///initialize HTML components for falling notes
const initialize_notes = () => {
  // clears out any existing notes in the trackContainer element by removing all its child nodes
  $notes_container = $("#notes_container")
  if ($notes_container.has('.note')) {
    $('#notes_container .note').remove;
  }
  
  
  song.sheet.forEach((key) => {
    $trackElement = $("#track" + key['name'])
    key.notes.forEach((note) => {
      $note = $("<div>").addClass('note').attr('id', note.name);
      $note.css('backgroundColor', key.color);
      $note.css('animation-duration', note.duration / speed + 's');
      $note.css('animation-delay', note.delay + 's');
      $note.css('animation-play-state', 'paused');
      $trackElement.append($note);
    })

  })
};

///set up css behaviour for speed buttons
const setup_speed = () => {
  $button = $(".speed_button_element");
  $button.on("click", function () {
    $(this).addClass('btn_selected')
    speed = parseInt($(this).text());
    console.log(speed)
    return speed;
  });
};

///set up css behaviour for start buttons
const click_start_button = () => {
  $('#start').on("click", () => {
    initialize_notes();
    $("#LILAC")[0].play();
    $(".note").css('display', 'block');
    $(".note").css('animation-play-state', 'running');
    $(".menu").css('opacity', '0.2');
    is_playing = true;
    startTime = Date.now();
  });
};

///initialize HTML components for falling notes
const hit_display = (score) => {
  $(".score_container").empty()
  $(".score_container").append($("<div>").attr('id', score).text(score));
  setTimeout(function () {
    $("#" + score).css('display', "none");
  }, 1000);
}



  ////////////////////////////////////////////////////////////
  /////////////score judgement and display////////////////
  ////////////////////////////////////////////////////////////

// calculate score, refer to the function below for the calculation of accuracy element
const score_calculator = (accuracy) => {
  if (accuracy < 0.1) {
    return 'perfect';
  } else if (accuracy < 0.2) {
    return 'good';
  } else if (accuracy < 0.3) {
    return 'bad';
  } else {
    return 'miss';
  }
}

//set up combo algorithm and prompt combo with html
const score_accumulator = (score) => {
  score_recorder[score] += 1

  if (score === 'good' || score === 'perfect') {
    maxcombo += 1;
  }
  else { maxcombo = 0 }

  if (maxcombo >= 2) {
    score_recorder['combo2'] += 1;
    $(".combo_container").empty()
    $(".combo_container").append($("<div>").attr('id', 'combo2').text('combo2'));
    setTimeout(function () {
      $('#combo2').css('display', "none");
    }, 1000);
  }

  if (maxcombo >= 4) {
    score_recorder['combo4'] += 1;
    $(".combo_container").empty()
    $(".combo_container").append($("<div>").attr('id', 'combo4').text('combo4'));
    setTimeout(function () {
      $('#combo4').css('display', "none");
    }, 1000);
  }
}

//prompt score with html
const score_display = (score_recorder) => {
  console.log(score_recorder)
  Jstr = JSON.stringify(score_recorder, null, 2)
  console.log(Jstr);
  $("#score_display").text(Jstr);

}


/////////////score judgementn////////////////
//0: everytime when user hit the key:
//1. determine the duration in mins for the current game
//2. initialize accuracy to be a negative number, because accuracy must to be a positive number in this case
//3. go through the note list to see when they would hit the ground by chronological order
/////the first note that is estimiated to fall after my current duration is my target note
//4. I would check the difference between my hit and estimated landed time for that note and assign a score 


const hitment_judge = (key) => {
  var timeInSecond = (Date.now() - startTime) / 1000;
  var accuracy = -99999;
  var temp = {
    's': 0,
    'space': 1,
    'k': 2,
  };

  notes_list = song.sheet[temp[key]].notes
  for (let i = 0; i < notes_list.length; i++) {
    item = notes_list[i];
    accuracy = item['delay'] + item['duration'] - timeInSecond
    if (accuracy > 0) {
      break;
    }
  }

  score = score_calculator(accuracy);
  hit_display(score);
  score_accumulator(score);
  score_display(score_recorder);
}


///set up css behaviour for nominated keys when they are hitten
const set_up_keys = () => {

  var keyIndex;
  var key;

  $(document).on("keydown", (event) => {
    keyIndex = event.which;
    if (keyIndex === 83) {
      key = 's';
    }
    else if (keyIndex === 32) {
      key = 'space';
    }
    else if (keyIndex === 75) {
      key = 'k';
    }
    else {
      key = -1;
    }
  }
  )

  ///keydown color code 
  $(document).on("keydown", (event) => {
    if (keyIndex === 83) {
      $("#keypresss").removeClass("hidden")
    }
    else if (keyIndex === 32) {
      $("#keypressspace").removeClass("hidden")
    }
    else if (keyIndex === 75) {
      $("#keypressk").removeClass("hidden")
    }
    if (is_playing && $("#track" + key).children().length) {
      hitment_judge(key)
    }
  }
  )

  //keyup behavious to nullify the keypress color
  $(document).on("keyup", (event) => {
    if (keyIndex === 83) {
      $("#keypresss").addClass("hidden")
    }
    else if (keyIndex === 32) {
      $("#keypressspace").addClass("hidden")
    }
    else if (keyIndex === 75) {
      $("#keypressk").addClass("hidden")
    }
  }
  )
}

// stop the audio
const stop_game = () => {
  isPlaying = false;
  $("#LILAC")[0].pause();
  $("#LILAC")[0].currentTime = 0
  $(".note").remove();
  $(".menu").css('opacity', '1');
}

//reset the game, this happens when user come back to main menu from score page. Would triger stop_game function to stop the audio. 
const reset_game = ()=>{
  stop_game();
      
  $("#result_menu").append($("<div>").text("Completed").attr("id", "result_title"));
  var total_score = 0;
  for (key in score_recorder) {
    var current_score
    current_score = Math.floor(score_recorder[key] * multiplier[key]);
    total_score += current_score;
    $("#result_menu").append($("<div>").text(key + ": " + score_recorder[key] + " score: " + current_score));
  }
  $("#result_menu").append($("<div>").text("Total Score: " + total_score).attr("id", "result_title"));
  $("#result_menu").append($("<div>").attr("id","backmain").text("back to main"));

    $('#backmain').on("click", () => {
      $("#result_menu").css("display", "none");
      $(".menu").css('opacity', '1');
      $("#score_display").text("");
      initialize_variables()
      $("#result_menu").empty();
      $(".btn_selected").removeClass('btn_selected');

    });      
  
  $("#result_menu").css("display", "flex");
}

// there are two scenarios to stop the games, the first is when player press esc, the second is when the song ends.
const set_up_stops = () => {

  var keyIndex;
  var key;
  //first scenario: esc
  $(document).on("keydown", (event) => {
    keyIndex = event.which;
    console.log(keyIndex);
    if (keyIndex === 27) {
      reset_game();
    }
  })

  //second scenario: music stop
  setTimeout(reset_game, song.duration);


}



$(() => {
  initialize_variables();
  initialize_layout();
  var speed = setup_speed();
  click_start_button();
  set_up_keys();
  set_up_stops();
})

