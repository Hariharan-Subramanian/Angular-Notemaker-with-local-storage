/* Angular Controllers */

/* Controller Function - NoteCtrl  */
function NoteCtrl($route) {
    var self = this;
    /*  En-route to the particular template  */
    $route.when('/main', {
        template: 'views/main.html',
        controller: NoteListCtrl
    });
    $route.when('/notes/remaind', {
        template: 'views/remaind.html',
        controller: NoteEditCtrl
    });
    $route.when('/notes/rlist', {
        template: 'views/remaindlist.html',
        controller: NoteEditCtrl
    });
    $route.when('/notes/add', {
        template: 'views/edit.html',
        controller: NoteEditCtrl
    });
    $route.when('/notes/pwd', {
        template: 'views/password.html',
        controller: NoteListCtrl
    });
    $route.when('/notes/login', {
        template: 'views/login.html',
        controller: NoteListCtrl
    });
    $route.when('/notes/help', {
        template: 'views/Help.html',
        controller: NoteListCtrl
    });
    $route.when('/notes/:viewsId', {
        template: 'views/list.html',
        controller: NoteListCtrl
    });
    $route.when('/notes/edit/:noteId', {
        template: 'views/edit.html',
        controller: NoteEditCtrl
    });
    $route.when('/notes/:noteId', {
        template: 'views/detail.html',
        controller: NoteDetailCtrl
    });

    $route.otherwise({
        redirectTo: '/main'
    });

    $route.onChange(function() {
        self.params = $route.current.params;
    });

    $route.parent(this);
}

/* Main Page controller */




var isloged = false;
/*  List Function  */
function NoteListCtrl(Note_) {
    var self = this;
    self.orderProp = 'title';
    self.notes = Note_.query();


    if (self.params.hasOwnProperty("viewsId")) self.note = self.params.viewsId;
    else self.note = {
        data: "main"
    };
    /* Delete Function */
    self.delete = function(id) {
        console.log("delete " + id);
        var deleteNotes = confirm('Are you sure you want to Delete?');
        if (deleteNotes) {
            Note_.delete(id);
            self.notes = Note_.query();
            //refreshes the view
            self.$root.$eval();
        }
    }

    self.edit = function(id) {
        window.location = "./index.html#/notes/edit/" + id;
    }



    self.savepwd = function() {
        if ($('#pwd').val() == $('#cpwd').val()) {
            localStorage.pwd = $('#pwd').val();
            localStorage.ispassword = true;
            window.location = "./index.html#/main";
        } else {
            alert('New possword and confirm password doesnot match');
        }
    }
    self.login = function() {
            if ($('#pwd').val() == localStorage.pwd) {
               $('#sidebar').css('visibility','visible');
                window.location = "./index.html#/main";
                isloged = true;

            } else {
                alert('Password doesnot match');
            }
        }
        /* Cance Function */
    self.cancel = function() {
        window.location = "./index.html";
    }

    if (localStorage.ispassword != null) {

        if (localStorage.ispassword) {
            var timeouttimer = setTimeout(function() {
                $('#passwordSet').hide()
                
                if (isloged == false) {
                	$('#sidebar').css('visibility','hidden');
                    window.location = "./index.html#/notes/login";
                }
                clearTimeout(timeouttimer);
            }, 200);
        }

    }

    if (self.note == 'update') {
        var timeouttimer = setTimeout(function() {
            $('#updateinfo').show();
            $('#deleteinfo').hide();
            $('.updated').show();
            $('.deleted').hide();


            clearTimeout(timeouttimer);
        }, 200);
    } else if (self.note == 'delete') {

        var timeouttimer = setTimeout(function() {
            $('#deleteinfo').show();
            $('#updateinfo').hide();
            $('.updated').hide();
            $('.deleted').show();
            clearTimeout(timeouttimer);
        }, 200);

    } else {
        isview = true;
    }
}


/* Details Function   */
function NoteDetailCtrl(Note_) {
    var self = this;
    self.note = Note_.get(self.params.noteId);

    if (typeof self.note === "undefined") window.location = "./index.html";
}

/* Edit Function  */
function NoteEditCtrl(Note_) {
    var self = this;

    if (self.params.hasOwnProperty("noteId")) self.note = Note_.get(self.params.noteId);
    else self.note = {
        title: "",
        body: ""
    };

    /* Cance Function */
    self.cancel = function() {
        window.location = "./index.html";
    }


    /*  Save Function  */
    self.save = function() {
        if (self.note.title != "" && self.note.body != "") {
            Note_.store(self.note);
            window.location = "./index.html";
        }
    }

}

/*  Note Services */

/* HTML 5 Local Storage has been used to store the data locally  */

angular.service('Note', function() {
    return {
        query: function() {
            var notes = [];
            for (var key in localStorage) {
                if (key.indexOf("note_") == 0) {
                    notes.push(JSON.parse(localStorage[key]));
                }
            }
            console.dir(notes);
            return notes;
        },
        delete: function(i) {
            localStorage.removeItem("note_" + i);
        },
        /* Get the Local Storage Data */
        get: function(i) {
            if (localStorage["note_" + i]) return JSON.parse(localStorage["note_" + i]);
            console.log("no note for " + i);
        },
        /*  Store the Local Storage Data */
        store: function(note) {
            if (!note.hasOwnProperty('id')) {
                //Find the highest id
                var notes = this.query();
                var highest = 0;
                for (var i = 0; i < notes.length; i++) {
                    if (notes[i].id > highest) highest = notes[i].id;
                }
                note.id = ++highest;
            }
            note.updated = new Date();
            localStorage["note_" + note.id] = JSON.stringify(note);
        }


    }

});

angular.service('remaind', function() {
    return {
        query: function() {
            var notes = [];
            for (var key in localStorage) {
                if (key.indexOf("note_") == 0) {
                    notes.push(JSON.parse(localStorage[key]));
                }
            }
            console.dir(notes);
            return notes;
        },
        /* Remove the Local Storage Data */
        delete: function(i) {
            localStorage.removeItem("note_" + i);
        },
        /* Get the Local Storage Data */
        get: function(i) {
            if (localStorage["note_" + i]) return JSON.parse(localStorage["note_" + i]);
            console.log("no note for " + i);
        },
        /*  Store the Local Storage Data */
        store: function(note) {
            if (!note.hasOwnProperty('id')) {
                //Find the highest id
                var notes = this.query();
                var highest = 0;
                for (var i = 0; i < notes.length; i++) {
                    if (notes[i].id > highest) highest = notes[i].id;
                }
                note.id = ++highest;
            }
            note.updated = new Date();
            localStorage["note_" + note.id] = JSON.stringify(note);
        }


    }

});
