'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        listcsslink   : {
            fileOne     : {
                src     : "src/"
            } , 
            fileTwo     : {
                src     : "src/"
            }
        }
    });

    // grunt.loadNpmTasks( "grunt-varJs" );
    grunt.loadTasks('tasks');
    grunt.registerTask( "default" , [ "listcsslink" ]);
};