//var multiselect = require("../libraries/lou-multi-select-57fb8d3/js/jquery.multi-select");
var charDiv = $(".userCharacters");
var campaignDiv = $(".userCampaigns");
var nameInput = $("input#charName");
var raceSelect = $("select.race");
var classSelect = $("select.class");
var levelInput = $("input#charLevel");
var bioInput = $("input#charBio");
var titleInput = $("input#campTitle");
var descriptionInput = $("input#campDesc");
var charactersInput = $("select.characters");

$(document).ready(function () {
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.name);
    $(".member-name").attr("id", data.id);

    // eslint-disable-next-line no-use-before-define
    getCharacterByUser(data.id);
    // eslint-disable-next-line no-use-before-define
    getCampaignByUser(data.id);

    // $("#new-character").modal().open();
    // $("#new-campaign").modal().open();

    $("form.character").on("submit", function (event) {
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!nameInput.val().trim()) {
        return;
      }
      console.log(data.id);
      // Constructing a newPost object to hand to the database
      var newCharacter = {
        name: nameInput.val().trim(),
        race: raceSelect.val().trim(),
        class: classSelect.val().trim(),
        level: levelInput.val().trim(),
        bio: bioInput.val().trim(),
        userId: data.id
      };

      submitCharacter(newCharacter);

      // Submits a new character and brings user to main page upon completion
      function submitCharacter(newCharacter) {
        console.log(newCharacter);
        $.ajax({
          method: "POST",
          url: "/api/character",
          data: newCharacter
        }).then(function () {
          window.location.href = "/main";
        });
      }

      // Update a given post, bring user to the blog page when done
      function updateCharacter(character) {
        $.ajax({
          method: "PUT",
          url: "/api/character/:id",
          data: character
        }).then(function () {
          window.location.href = "/main";
        });
      }
    });

    $("form.campaign").on("submit", function (event) {
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!titleInput.val().trim()) {
        return;
      }
      console.log(data.id);
      // Constructing a newPost object to hand to the database
      var newCampaign = {
        title: titleInput.val().trim(),
        description: descriptionInput.val().trim(),
        characters: JSON.stringify(charactersInput.val()),
        userId: data.id
      };

      submitCampaign(newCampaign);

      // Submits a new character and brings user to main page upon completion
      function submitCampaign(newCampaign) {
        console.log(newCampaign);
        $.ajax({
          method: "POST",
          url: "/api/campaigns",
          data: newCampaign
        }).then(function () {
          window.location.href = "/main";
        });
      }

      // Update a given post, bring user to the main page when done
      function updateCampaign(campaign) {
        $.ajax({
          method: "PUT",
          url: "/api/campaigns/:id",
          data: campaign
        }).then(function () {
          window.location.href = "/main";
        });
      }
    });

    //function gets the list of characters associated to the user"s unique ID

    function getCharacterByUser(userId) {
      console.log(userId);
      $.get("/api/character/user/" + userId, function (data) {
        if (data) {
          console.log(data);
        }
      }).then(function (data) {
        var userCharacterList = [];
        var charUl = $("<ul>").attr("class", "collapsible");
        console.log(data, "this is the character data");

        for (i = 0; i < data.length; i++) {
          var charLi = $("<li>" + data[i].name + "</li>").attr("class", "collapsible-header");
          var charInfoDiv = $("<div>").attr("class", "collapsible-body").attr("id", data[i].id);
          var raceSpan = $("<p>Race: " + data[i].race + "<p>");
          var classSpan = $("<p>Class: " + data[i].class + "</p>");
          var levelSpan = $("<p>Level: " + data[i].level + "</p>");
          var bioSpan = $("<p>Bio: " + data[i].bio + "</p>");
          var buttonDiv = $("<div>").attr("class", "buttonDiv");
          var editButton = $("<button>Edit</button>").attr("class", "charEdit btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          var deleteButton = $("<button>Delete</button>").attr("class", "charDelete btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          charInfoDiv.append(raceSpan);
          charInfoDiv.append(classSpan);
          charInfoDiv.append(levelSpan);
          charInfoDiv.append(bioSpan);
          buttonDiv.append(editButton);
          buttonDiv.append(deleteButton);
          charInfoDiv.append(buttonDiv);
          charLi.append(charInfoDiv);
          charUl.append(charLi);
          charDiv.append(charUl);
          userCharacterList.push(data[i].name);
        }
        console.log(charUl);
        $(".collapsible-header").click(function (event) {
          event.stopPropagation();
          event.stopImmediatePropagation();
          $(this).children("div.collapsible-body").stop(true, true).slideToggle("fast"),
          $("div.collapsible-body").toggleClass("dropdown-active");
          event.stopPropagation();
          event.stopImmediatePropagation();
        });
      });
    }

    function getCampaignByUser(userId) {
      $.get("/api/campaign/user/" + userId, function (data) {
        if (data) {
          // If this character exists, prefill our cms forms with its data
          titleInput.val(data.title);
          descriptionInput.val(data.description);
          charactersInput.val(data.characters);
          // If we have a post with this id, set a flag for us to know to update the post
          // when we hit submit
        }
      }).then(function(data){
        var campUl = $("<ul>").attr("class", "collapsible");
        for (i = 0; i < data.length; i++) {
          var campLi = $("<li>" + data[i].title + "</li>").attr("class", "collapsible-header");
          var campInfoDiv = $("<div>").attr("class", "collapsible-body").attr("id", data[i].id);
          var descList = $("<p>Description: " + data[i].description + "<p>");
          var charList = $("<p>Players: " + JSON.parse(data[i].characters) + "<p>");
          var buttonDiv = $("<div>").attr("class", "buttonDiv");
          var editButton = $("<button>Edit</button>").attr("class", "campEdit btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          var deleteButton = $("<button>Delete</button>").attr("class", "campDelete btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          campInfoDiv.append(descList);
          campInfoDiv.append(charList);
          buttonDiv.append(editButton);
          buttonDiv.append(deleteButton);
          campInfoDiv.append(buttonDiv);
          campLi.append(campInfoDiv);
          campUl.append(campLi);
          campaignDiv.append(campUl);
        }
        $(".collapsible-header").click(function (event) {
          event.stopPropagation();
          event.stopImmediatePropagation();
          $(this).children("div.collapsible-body").stop(true, true).slideToggle("fast"),
          $("div.collapsible-body").toggleClass("dropdown-active");
          event.stopPropagation();
          event.stopImmediatePropagation();
        });
      });
    }
    $(".charEdit").on("submit", function (event) {
      var charId = $this.attr("id");
      console.log(charId);
      getCharacterById(charId);
    });
  });
  function classList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/classes/"
    }).then(function (data) {
      var classes = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        classes.push(data.results[i].name);
      }
      renderClassDropdown(classes);
    });
  }
  function renderClassDropdown(classes) {
    var classSelect = $("select.class");
    for (i = 0; i < classes.length; i++) {
      var option = $(
        "<option value=" + classes[i] + ">" + classes[i] + "</option>"
      );
      classSelect.append(option);
    }
  }

  function raceList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/races/"
    }).then(function (data) {
      var races = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        races.push(data.results[i].name);
      }
      renderRaceDropdown(races);
    });
  }
  function renderRaceDropdown(races) {
    var raceSelect = $("select.race");
    for (i = 0; i < races.length; i++) {
      var option = $(
        "<option value=" + races[i] + ">" + races[i] + "</option>"
      );
      raceSelect.append(option);
    }
  }

  function characterList() {
    $.ajax({
      method: "GET",
      url: "/api/character"
    }).then(function (data) {
      console.log(data);
      var characters = [];
      console.log(data);
      for (i = 0; i < data.length; i++) {
        characters.push(data[i].name);
      }
      renderCharacterDropdown(characters);
    });
  }

  function renderCharacterDropdown(characters) {
    var characterSelect = $("select.characters");
    for (i = 0; i < characters.length; i++) {
      var option = $(
        "<option value=" + characters[i] + ">" + characters[i] + "</option>"
      );
      characterSelect.append(option);
    }
  }

  function getCharacterById(charId) {
    console.log(charId);
    $.ajax({
      method: "GET",
      url: "/api/character/" + charId,
      function(data) {
        if (data) {
          console.log(data);
          nameInput.val(data.name);
          raceSelect.val(data.race);
          classSelect.val(data.class);
          levelInput.val(data.level);
          bioInput.val(data.bio);
        }
      }
    })
      .then(function (data) {
        console.log("Character Update" + data);

      });
  }

  $(".modal").modal();
  $(".modal-trigger").modal();

  classList();
  raceList();
  characterList();
});

// function renderAuthorList(rows) {
//   authorList.children().not(":last").remove();
//   authorContainer.children(".alert").remove();
//   if (rows.length) {
//     console.log(rows);
//     authorList.prepend(rows);
//   }
//   else {
//     renderEmpty();
//   }
// }

// // Function for handling what to render when there are no authors
// function renderEmpty() {
//   var alertDiv = $("<div>");
//   alertDiv.addClass("alert alert-danger");
//   alertDiv.text("You must create an Author before you can create a Post.");
//   authorContainer.append(alertDiv);
// }
