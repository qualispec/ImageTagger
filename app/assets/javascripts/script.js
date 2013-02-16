tagOptions = [ "Wolverine", "Cyclops", "Colossus", "Storm", "Rogue", "Iceman",
               "Gambit", "Cable" ];

// This is the tagControllerMaker -- pass in the element to bind it to
function pickTagController (element) {
  // here is the actual object being built
  var clicksController = {
    // initialize the object with a undefined image
    image: undefined,

    //this is the bind function of the object, which passes in the image
    // object (as a jquery object)
    // is called near the end of the maker function
    bind: function (image) {

      // sets the object's image to the passed in image
      this.image = $(image);
      // creates the event handler to be bound to this specific
      // photo that was passed in.
      this.image.click(this.handleClick.bind(this));
    },

    // this is the event handler, receives an event
    // still don't know how it receives an event
    handleClick: function (event) {
      // sets the variable rel position based on the click event
      var relPos = {
        x: (event.pageX - 52),
        y: (event.pageY - 52)
      };

      // passes the positions to addTagList
      this.addTagList(relPos);
    },

    // takes a position object
    addTagList: function (pos) {
      // selects clickContainer
      $(".clickContainer")
        // displays the clickContainer, which was already in the DOM
        // but was hidden
        .show()
        // sets the css to position the container
        .css("left", pos.x)
        .css("top", pos.y)
        // sets the html in it to nothing
        .empty();

      // this appends the tag square (adds the pretag)
      $(".clickContainer").append(
        // creating a div wrapped in a jquery object
        $("<div></div>")
          // add the class of pretag in order to style it
          .addClass("pretag")
      );

      // selects the click container again in order to append a new div for the
      //listcontainer
      $(".clickContainer").append(
        // creates a new div wrapped in a jquery object
        $("<div></div>")
          // add class to give styling
          .addClass("listContainer")
      );

      // this goes through all of the tags that exist and adds the
      // tag names to the tag box
      $(tagOptions).each( function() {
        // append a list option div to each of the list container
        $(".listContainer").append(
          $("<div>" + this + "</div>")
            .addClass("listOption")
        );
      });

      $(".listOption").click(this.listOptionClick);
    },

    listOptionClick: function(event) {
      console.log("Tag Inserted");
      $(".tagContainer").append(
        $("<div></div>")
          .addClass("tag")
          .css("left", $(".clickContainer").css("left"))
          .css("top", $(".clickContainer").css("top"))
          .html("<span class='name'>" + $(this).text() + "</span>")
      );
      $(".clickContainer").html("").hide();

      var newTag = { id: null,
                     name: $(this).text(),
                     x: $(".clickContainer").css("left"),
                     y: $(".clickContainer").css("top") };

      IT.Tag(newTag.id, newTag.name, newTag.x, newTag.y).save();
    }

  }

  clicksController.bind(element);

  return clicksController;
}


function toggleListener (element) {
  var clicksController = {
    show: true,
    button: null,

    bind: function (button) {
      this.button = $(button);

      this.button.click(this.handleClick.bind(this));
    },

    handleClick: function (event) {

      $(".clickContainer").empty();

      if (this.show) {
        $(".tag").css("visibility", "hidden");
        this.show = false;
      } else {
        $(".tag").css("visibility", "visible");
        this.show = true;
      }
    }
  }

  clicksController.bind(element);

  return clicksController;
};


$(function () {
  var image = $(".image");

  pickTagController(image);

  // add existing stored tags
  toggleListener($(".toggle"));
  IT.Tag.fetchAll(render);

});

var IT = (function() {
  function Tag(id, name, x, y) {
    var that = this;

    this.id = null;
    this.name = name;
    this.x = x;
    this.y = y;

    this.save = function(callback) {
      $.post("/tags.json", {
        tag: {
          id: this.id,
          name: this.name,
          x: this.x,
          y: this.y
        }
      }, function (response) {
        console.log(response);
        that.id = response.id;

        if (callback) {
          callback();
        }
      });
    }
    return this;
  };

  Tag.all = [];
  Tag.fetchAll = function(callback) {
    $.getJSON(
      "/tags.json",
      function (data) {
        Tag.all = [];
        _.each(data, function(datum){
          Tag.all.push(new Tag(
            datum.id, datum.name, datum.x, datum.y));
        });
        storedTags = Tag.all;

        if (callback) {
          callback();
        }
      }
    );
  }

  return {
    Tag: Tag

  };
})();



function render() {
  $(storedTags).each(function() {
    $(".tagContainer").append(
      $("<div></div>")
        .addClass("tag")
        .css("left", this.x)
        .css("top", this.y)
        .html("<span class='name'>" + this.name + "</span>")
    );
  });
}



















































