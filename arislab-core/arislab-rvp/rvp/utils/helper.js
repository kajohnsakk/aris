module.exports = {
    isPath: function ( str ) {
        if( str && str.length > 0 ){
            const pattern = new RegExp("^(.+)/([^/]+)$");
            return pattern.test(str) && !str.includes("\\n");
        }
        return false;
    }
};