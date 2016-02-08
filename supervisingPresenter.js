// Supervising presenter
// ---------------------

// View fires event (action), listens model.
// Controller manages views and models, adds event handlers.

// Model
// -----
var Model = Backbone.Model.extend({
    urlRoot: '/api/to/model',
    defaults: {
        name: null,
        pass: null
    }
});

// View. Passive view
// ------------------
var View = Marionette.ItemView.extend({
    // Transform low-level *DOM* event in app event
    // button click -> save model
    triggers: {
        'click [data-action=submit]': 'submit'
    }
});

// Controller. Supervising presenter
// ---------------------------------
var Controller = Marionette.Controller.extend({
    initialize : function(options) {
        // models
        this.user = options.user;
        // region, views
        this.mainRegion = options.mainRegion;
        this.Views = options.Views;
    },

    onShowUserView: function() {
        // create view
        var that = this,
            userView = new that.Views.UserView({
                model: that.user
            });

        // update model
        that.user.set('someProp', 'someValue');
        // add event handler
        userView.on('submit', function() {
            that.user.save();
        });

        // render view
        that.mainRegion.show(userView);
    }
});

// Router
// ------
var Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'onShowUserView'
    }
});

// Using in app.
App.router = new Router({
    controller: new Controller({
        user: new Model({
            name: 'user',
            pass: '123456'
        }),
        Views: {
            UserView: View
        },
        mainRegion: App.userRegion
    })
});

//Using in test.
var controller = new Controller({
    user: testUser,
    Views: {
        UserView: MockView
    },
    mainRegion: testRegion
});