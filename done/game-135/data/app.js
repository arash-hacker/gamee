/***************************************************************************/
/*                                                                         */
/*  This obfuscated code was created by Javascript Obfuscator Free Version.*/
/*  Javascript Obfuscator Free Version can be downloaded here              */
/*  http://javascriptobfuscator.com                                        */
/*                                                                         */
/***************************************************************************/
eval(
  (function () {
    var z = [
      74,
      60,
      81,
      79,
      76,
      88,
      71,
      72,
      90,
      89,
      87,
      70,
      65,
      86,
      66,
      80,
      94,
      82,
      75,
      85,
    ];
    var q = [];
    for (var u = 0; u < z.length; u++) q[z[u]] = u + 1;
    var s = [];
    for (var w = 0; w < arguments.length; w++) {
      var x = arguments[w].split("~");
      for (var p = x.length - 1; p >= 0; p--) {
        var y = null;
        var v = x[p];
        var i = null;
        var j = 0;
        var g = v.length;
        var d;
        for (var f = 0; f < g; f++) {
          var m = v.charCodeAt(f);
          var r = q[m];
          if (r) {
            y = (r - 1) * 94 + v.charCodeAt(f + 1) - 32;
            d = f;
            f++;
          } else if (m == 96) {
            y =
              94 * (z.length - 32 + v.charCodeAt(f + 1)) +
              v.charCodeAt(f + 2) -
              32;
            d = f;
            f += 2;
          } else {
            continue;
          }
          if (i == null) i = [];
          if (d > j) i.push(v.substring(j, d));
          i.push(x[y + 1]);
          j = f + 1;
        }
        if (i != null) {
          if (j < g) i.push(v.substring(j));
          x[p] = i.join("");
        }
      }
      s.push(x[0]);
    }
    var h = s.join("");
    var e = "abcdefghijklmnopqrstuvwxyz";
    var c = [39, 42, 126, 96, 10, 92].concat(z);
    var k = String.fromCharCode(64);
    for (var u = 0; u < c.length; u++)
      h = h.split(k + e.charAt(u)).join(String.fromCharCode(c[u]));
    return h.split(k + "!").join(k);
  })(
    'var _$_2e18=["C@sN@t@sS","@ranta @marden","JX","JXJ^fanta_garden","mJc01","mJc02","podkan01","podkan02","undefined","type"JOe-unknown","J[ing","scorJ^destroJbreset","resume"JOStart","InJX","x","moJ\\android","devicJ^i@jS"JOe-mobilJ^@kaunchJP","@xeadJblaunch","Dead","JM","prototypJ^spawnItem","spawnEnemy@rast","creatJ^timJ^@rastSpawning","finish","imagJ^add","start","length","moving@kawnMowers","bodJbspritJ^grass","intersects","arcadJ^physics","index@jf","keJbpick@uonus","shaveJQl","aliJ\\push","damagJ^is@vlaying","unlock@sJe","plaJbkosJc_01_cislo1","kosJc_01_cislo2","kosJc_01_cislo3","children","@uasic","@kinJ^discJQtJ^damage@xow","@xow","damageNear","JbExplosiJ\\namJ^forEach@sliJ\\onDied","End"JO@jver"JIJ`= new @vhaserJ=2]](640,640,@vhaserJ=0]J;1],{init:init,preload:preload,create:create})JNldaEngine= new @sldaEngine(J`,ImplementationJ=3]J;4])JVJQlSprites=J=5J;6J;7J;8]JIJXState={J[ing:0,@kaunchJP:1,@xeady:2,InJX:3,@rastSpawning:4,Dead:5,End:6}JV@m@sME_T@p@vE=( typeof $J`eNative!==JC9])?$J`eNativeJ=10]]:JC11JIJ9J 12]JIJ/=@JTStartingJ@JNJeEnabled=truJLautoJ[=JdJLJ1=JdJLfirst@rocus=truJLplayerJVJD=nullJVfieldJVplusTextJVeJEJNnimJNJeCatJJ@xatJJDiscJJMowerJJEJEJJ@uonusJJEndJVlawnMowerJVgrassManagerJVeffects;J>startJX(){J$[13]]=0;J1=Jde;if(JD){JDJ=14JWJD=null};J#15JWgJ![15JWJ$[16JWJ$[17JWJ9J 18]]}J>JM@JTJ@(){playerJ=19]]=J/@b128+64;J#20]](playerJ=19]])}J>J%{return first@rocus&&!J422J821]]&&!J422J823]]&&(@m@sME_T@p@vE!==JC24])}fJ2@zpJHJ%J0J&J 12]]J?J*J JfJBJ) J 26JAJ(J 18]]:J#27]](J/J5J J7J-fJ2DownJHJ%J0J&J 12]]J?J*J JfJBJ) J 26JAJ(J J7J-fJ2@xightJHJ%J0J&J 12]]J?J*J JfJBJ) J 26JAJ(J 18]JYJ/@h4){J/++};JM@JTJ@()JK;JZJ J7J-fJ2@keftJHJ%J0J&J 12]]J?J*J JfJBJ) J 26JAJ(J 18]JYJ/>1){J/--};JM@JTJ@()JK;JZJ J7J-J[ingStateJ=30J829]]=function(){switcJ&J 18]]:gJ![31JWJ#29JWcheckCollisions()JK;JZJ 35]JY!J1&&!gJ![32]]()){J1=truJL@v=J434J833]](trueJ38]](650,functionJHJ9==J 35J_J9J 28]];JD=J438J837]](0,0,JC36])JV@v=J434J833]](trueJ38]](2000,J`@jverJP,thisJ39]]()}},thisJ39]]()}JK}};J>checkCollisions(){for(var p=J#41J840]]-1;p>=0;--p){var bv=J#41]][pJIbE=JUJ,42]JIb@r=bvJ:4]];fieldJ=71]](function(a){if(J447J846J845]](bE,aJ:2]])){if(J648J]!== -1){JFif(aJ:9]]===@ranta@jrange@uonusJ:3J_gJ![50JSJFif(JQlSpritesJ:8]](aJ:9]])>=0){gJ![51JSif(aJ=52J_J653J]};JFswitch(bvJ=10J870J_JZJC62]:gJ![5Jaa,1);J653J]J.&&!auJ+5J_J$J<J+7JRswitch(JUJ,61]][0]J:9J_JZJC58]:J#JGJ\'8[59JYJ640]]===2){J#1Jap)}J\'8[60JYJ640]]===3){J#1Jap)}JK}J\'8[63]:gJ![5Jaa,1)J.&&!auJ+5J_J$J<J+7JRif(aJ=52J_J653J]}J\'8[66]:J#6Jabv);gJ![65JSJ#JGJ\'8[69]:gJ![67JSeJEJ=15]](JUJ,19]],JUJ,68]],1);animJ=57]](20,Jde,Jde)J.){J$[56JWaJeEJEJ=57JRJ#JGJK}}},this)}}J>dieJHJ9==J 28J_return}J.){J$[56JWaJeEndJ=57JRJ9J 35]];J#72]]()}J>J`@jverJPJHJ`State!==J 28J_JFJ9J 73]];J$[7Ja)}~@mameStateJ=~rassManager[_$_2e18~J&@~lawnMowerJ=~aldaEngine[_$_2e18~cannotStartJX()~h(gameState){JZ~JK;case _$_2e1~mame(J5~@koad()JK;case~d=trueJK;case ~dioMowerJ=5~2e18[43J8~erScreen()JK}}~;if(aJeEnabled~playerJ@~){JFswitc~waiting@rorEnd~unction button~);@vJ=3~gameJ=~)JK;case ~b@rJ=~28]]:J`@jv~]]J=~J`State=~J=4~],JC~[56JWau~[JC~function ~:auto@koa~@vosition~]]:start@~:complete~_$_2e18[~endImage~xplosion~return};~1Jap)~(){if(~]JV~,aJe~;break~eJV~update~JVa~,"J`~Screen~@snima~]]()};~J];~vlayer~bv[_$_~;var ~]]();~@mame~]:if(~case ~@koad~vJ^~]](a)~e","~]]){~game~4]](~y","~acka~fals~udio~25]]'
  )
);
