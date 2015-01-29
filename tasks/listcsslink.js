var sys,
    Linkcss,
    grunt,
    E;

E = function( x , displayKey ){
    if( typeof x == "object" ){
        for( var a in x ){
            if( typeof a == "string" ){
                E( a );
            }
            E( x[ a ] );
        };
    } else {
        grunt.log.writeln( x );
    };
};

function Linkcss( src ){
    var _self = this;
    this.fileMaps = {};
    src = src.src || src;
    grunt.file.recurse( src , function( file ){
        if( /\.html?$/.test( file ) ) {
            _self.fileMaps[ file ] = _self.getFileCode( file );
            grunt.file.write( file , _self.fileMaps[ file ] );
        };
    } );
}

Linkcss.fn = Linkcss.prototype;

Linkcss.fn.getFileCode = function( file ){
    var _str    = grunt.file.read( file ).split( "</head>" ),
        _gap    = "==bo==",
        _links,
        _bodyLinks = [];
    if ( _str.length >= 2 ) {
        _links  = _str[ 1 ].replace( /(<link[^\>]*>)/gi , _gap + "$1" + _gap ).split( _gap );
        for( var i = _links.length; i--; ){
            if( i % 2 ){
                _bodyLinks.push( _links[ i ] );
                _links[ i ] = "";
            }
        }
        _str[ 0 ] += _bodyLinks.join( "" ); 
        _str[ 1 ] = _links.join( "" ); 
    }
    return _str.join( "</head>" );
}

module.exports = function( __grunt ){
    grunt = __grunt;
    grunt.registerMultiTask( "listcsslink" , "Test" , function(){
        sys = this;
        new Linkcss( sys.data );
    } );    
};