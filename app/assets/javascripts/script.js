tagOptions = [ "Wolverine", "Cyclops", "Colossus", "Storm", "Rogue", "Iceman",
               "Gambit", "Cable" ];

function pickTagController (element) {
  var clicksController = {
    image: undefined,

    bind: function (image) {

      this.image = $(image);
      this.image.click(this.handleClick.bind(this));
    },

    handleClick: function (event) {
      var relPos = {
        x: (event.pageX - 52),
        y: (event.pageY - 52)
      };

      this.addTagList(relPos);
    },

    addTagList: function (pos) {
      var that = this;
      $(".clickContainer")
        .show()
        .css("left", pos.x)
        .css("top", pos.y)
        .empty();

      $(".clickContainer").append(
        $("<div></div>")
          .addClass("pretag")
      );

      $(".clickContainer").append(
        $("<div></div>")
          .addClass("listContainer")
      );

      $(".clickContainer").prepend(
        $('<input id="tag-input" type="text">')
        );

      // $(tagOptions).each( function() {
      //   $(".listContainer").append(
      //     $("<div>" + this + "</div>")
      //       .addClass("listOption")
      //   );
      // });

      // $(".listOption").click(this.listOptionClick);
      $(".listContainer").on("click", ".listOption", this.listOptionClick);

      // $("#tag-input").keypress(function(){console.log($(this).val())});
      $("#tag-input").keyup(this.autoCompleteHandler);

    },

    autoCompleteHandler: function(event) {

      string = $(this).val().toLowerCase();
      tagOptions = tagOptions.sort();

      if (string.length == 0) {
        $('.listContainer').empty();
      } else {
        $('.listContainer').empty();

        for(var i in tagOptions) {
          if (tagOptions[i].toLowerCase().match(string)) {
            $(".listContainer").append(
            $("<div>" + tagOptions[i] + "</div>")
              .addClass("listOption")
            ) };
        }
      };
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











