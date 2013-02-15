tags = [ { name: 'Wolverine',
           x: 500,
           y: 500 },
         { name: 'Cyclops',
           x: 800,
           y: 800 },
         { name: 'Rogue',
           x: 1000,
           y: 1000 } ];


function pickTagController (element) {
  var clicksController = {
    image: null,

    bind: function (image) {
      this.image = $(image);
      this.image.click(this.handleClick.bind(this));
    },

    handleClick: function (event) {
      var relPos = {
        x: (event.pageX - 77),
        y: (event.pageY - 77)
      };

      this.addTagList(relPos);
    },

    addTagList: function (pos) {
      $(".clickContainer")
        .show()
        .css("left", pos.x)
        .css("top", pos.y)
        .html("");

      $(".clickContainer").append(
        $("<div></div>")
          .addClass("listContainer")
      );

      $(".clickContainer").append(
        $("<div></div>")
          .addClass("pretag")
      );

      $(tags).each( function() {
        $(".listContainer").append(
          $("<div>" + this.name + "</div>")
            .addClass("listOption")
        );
      });
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

  $(".clickContainer .listOption").live("click", function() {
    console.log("Tag Inserted");
    $(".tagContainer").append(
      $("<div></div>")
        .addClass("tag")
        .css("left", $(".clickContainer").css("left"))
        .css("top", $(".clickContainer").css("top"))
        .html($(this).text())
    );
    $(".clickContainer").html("").hide();
  });
});