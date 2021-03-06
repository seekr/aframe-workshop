AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    frameSkip: 5, //amount of frames to skip (higher is faster)
    mameVolume: -5, //volume adjustment in dB for arcade machine

    init: function () {

        var sceneEl = document.querySelector('a-scene');

        console.log('el: ',sceneEl);

        const cursorEl = document.getElementById("my-cursor");


        sceneEl.addEventListener('loaded',function(){

            var superHands = cursorEl.components['super-hands'];

            window.addEventListener('mousedown',function(e){
                console.log('mousedown');
                superHands.onGrabStartButton();
            });

            window.addEventListener('mouseup',function(e){
                console.log('mouseup');
                superHands.onGrabEndButton();
            });
        });

        sceneEl.addEventListener('renderstart',function(){

            console.log('Ready');

            //mess binaries can be downloaded from: https://archive.org/details/emularity_engine_jsmame

            //list of popular MAME games on IA: https://archive.org/details/internetarcade

            //local ROM
            //var emulator = this.loadMAME('bublbobl'); //good performance

            //Z80 based games tend to work better

            //configs downloadable from https://archive.org/download/emularity_config_v1
            //var emulator = this.loadIAGame("arcade_flicky");
            //var emulator = this.loadIAGame("arcade_qbert");
            var emulator = this.loadIAGame("arcade_marble"); //good performance
            //var emulator = this.loadIAGame("arcade_rtype2"); //good performance
            //var emulator = this.loadIAGame("arcade_altbeast");
            //var emulator = this.loadIAGame("arcade_hellfire"); //good performance

            //var emulator = this.loadIAGame("arcade_imgfight"); //good performance

            //var emulator = this.loadIAGame("arcade_dyger"); //good performance
            //var emulator = this.loadIAGame("arcade_rtype"); //good performance
            //var emulator = this.loadIAGame("arcade_wb3"); //good performance
            //var emulator = this.loadIAGame("arcade_wbml"); //good performance
            //var emulator = this.loadIAGame("arcade_wboy"); //good performance



            emulator.setScale(1);
            emulator.start({ waitAfterDownloading: false });

            this.initSCWidget();

        }.bind(this));



    },

    initSCWidget: function(){
        var scWidgetEl = document.querySelector('#sc-widget');

        if(scWidgetEl){
            var rnd = Math.floor(Math.random() * 9) + 0;

            scWidgetEl.setAttribute('src','https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/349520772&color=ff5500&start_track='+rnd+'&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false');

            var scWidget = SC.Widget(scWidgetEl);

            scWidget.bind(SC.Widget.Events.READY, function() {
                console.log('Soundcloud player widget ready');
                scWidget.play();
                scWidget.setVolume(20);
            });
        }
    },

    insertCoin: function(){
        // Bind event handler
        /*$('body').keypress(function (e) {
            alert(String.fromCharCode(e.which));
            console.log(e);
        });*/
        // Simulate the key press
        $('body').simulateKeyPress('5');
    },

    loadMAME: function(identifier) {
        console.log('Loading mame game: '+identifier);

        return new Emulator(document.querySelector("#fullscreen"),
            {
                before_emulator: function(){
                    console.log('On before emulator callback');
                },
                before_run: this.onBeforeRun()
            },
            new JSMAMELoader(JSMAMELoader.driver(identifier),
                JSMAMELoader.nativeResolution(256, 256),
                JSMAMELoader.extraArgs(['-fs', String(this.frameSkip), '-nosleep', '-nojoy', '-pause_brightness', '0.3', '-nosamples', '-volume', String(this.mameVolume)]), //full list of commands available here: http://docs.mamedev.org/commandline/commandline-all.html
                JSMAMELoader.sampleRate('44000'),
                JSMAMELoader.emulatorJS("assets/js/emularity/emulators/jsmess/mame"+identifier+".js.gz"), //bios files can be downloaded from https://archive.org/download/emularity_engine_v1/
                JSMAMELoader.mountFile(identifier+".zip",
                    JSMAMELoader.fetchFile("Game File",
                        "assets/js/emularity/emulators/jsmess/"+identifier+".zip")),
                JSMAMELoader.mountFile(identifier+".cfg", //config files can be downloaded from https://archive.org/download/jsmess_config_v2/
                    JSMAMELoader.fetchFile("Config File",
                        "assets/js/emularity/emulators/configs/"+identifier+".cfg")
                )
            )
        );
    },

    /**
     * Load a game from the Internet Archive
     * @param identifier String of the game identifier in the URL or listed on the page
     */
    loadIAGame: function(identifier) {
        return new IALoader(document.querySelector("#fullscreen"),
            identifier,
            {
                before_emulator: function(){
                    console.log('On before emulator callback');
                },
                before_run: function(){
                    this.onBeforeRun(identifier)
                }.bind(this)
            }
        );

    },

    onBeforeRun: function(identifier){
        console.log('On before run callback');
        var screenEl = document.querySelector('#screen');
        document.querySelector('#marquee').setAttribute('src','#'+identifier);
        console.log('screenEL',screenEl);
        screenEl.setAttribute('material','shader','draw'); //switch from the gif material shader to the emulator canvas shader
    },

    tick: function (t, dt) {


    }
});


