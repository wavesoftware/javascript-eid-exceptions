module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },
    entry: 'src/main/javascript',
    output: {
        filename: 'eid.js',
        path: 'target/dist'
    },
    module: {
        preLoaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader?stage=0'
            }
        ]
    }
};
