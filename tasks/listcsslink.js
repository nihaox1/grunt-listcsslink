var sys,
    UniqueLink,
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

function UniqueLink( src ){
    var _self = this;
    this.fileMaps = {};
    src = src.src || src;
    grunt.file.recurse( src , function( file ){
        if( /\.html?$/.test( file ) ) {
            _self.fileMaps[ file ] = _self.filterLink( _self.getFileCode( file ) );
            grunt.file.write( file , _self.fileMaps[ file ] );
        };
    } );
}

UniqueLink.fn = UniqueLink.prototype = {
    constructor     : UniqueLink ,
    getFileCode     : function( file ){
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
    } ,
    filterCss   : function( file ){
        var _reg    = /(<link[^\>]*>)/gi ,
            _gap    = "==bo==" ,
            _links  = file.replace( _reg , _gap + "$1" + _gap ).split( _gap ) ,
            _hasLink= {} ,
            _href;
        for( var i = 0 , len = _links.length; i < len; i++ ){
            if( i % 2 ){
                _href           = _links[ i ].replace( /.*href=[\'|\"]([^\'|^\"]*)[\'|\"].*/, "$1" );
                _links[ i ]     = _hasLink[ _href ] ? "" : _links[ i ];
                _hasLink[ _href ]    = true;
            }
        }
        return _links.join( "" );
    } ,
    filterJs    : function( file ){
        var _reg    = /(<script(\s+[\d|\w|_]*=[\'|\"][^\'|^\"]*[\'|\"]){2}\s*><\/script>)/gi ,
            _gap    = "==bo==" ,
            _links  = file.replace( _reg , _gap + "$1" + _gap ).split( _gap ) ,
            _hasLink= {} ,
            _src;
        for( var i = 0 , len = _links.length; i < len; i++ ){
            if( i % 2 ){
                _src            = _links[ i ].replace( /.*src=[\'|\"]([^\'|^\"]*)[\'|\"].*/, "$1" );
                _links[ i ]     = _hasLink[ _src ] ? "" : _links[ i ];
                _hasLink[ _src ]    = true;
            }
        }
        return _links.join( "" );
    } ,
    filterTemplate : function( file ){
        var _reg    = /(<script(\s+[\d|\w|_]*=[\'|"][^\'|^"]*[\'|"])+\s*>(.(?!script>))+<\/script>)/gi ,
            _gap    = "==bo==" ,
            _links  = file.replace( _reg , _gap + "$1" + _gap ).split( _gap ) ,
            _hasLink= {} ,
            _id;
        for( var i = 0 , len = _links.length; i < len; i++ ){
            if( i % 2 && /id=/.test( _links[ i ] ) ){
                _id             = _links[ i ].replace( /.*id=[\'|\"]([^\'|^\"]*)[\'|\"].*/, "$1" );
                _links[ i ]     = _hasLink[ _id ] ? "" : _links[ i ];
                _hasLink[ _id ]    = true;
            }
        }
        return _links.join( "" );
    } ,
    /*!
     *  过滤相同引用的css&js 或者同名id的js模版文件
     */
    filterLink  : function( file ){
        var _gap    = "==bo==" ,
            _replace= _gap + "$1" + _gap ,
            _reg    = {
                css     : /(<link[^\>]*>)/gi,
                js      : /(<script(\s+[\d|\w|_]*=[\'|\"][^\'|^\"]*[\'|\"]){2}\s*><\/script>)/gi ,
            };
        return this.filterTemplate( this.filterJs( this.filterCss( file ) ) );
    }
};

module.exports = function( __grunt ){
    grunt = __grunt;
    grunt.registerMultiTask( "listcsslink" , "Test" , function(){
        sys = this;
        new UniqueLink( sys.data );
    } );    
};