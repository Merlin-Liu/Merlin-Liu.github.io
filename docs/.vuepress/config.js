module.exports = {
    title: 'Niko\'s blog',
    description: '自我驱动～',
    head: [
        ['link', { rel: 'icon', href: 'https://github.com/fluidicon.png' }]
    ],
    themeConfig: {
        nav: [
            { text: 'Blog', link: '/blog/' },
            { text: 'Old blog', link: '/oldBlog/' },
            { text: 'My GitHub', link: 'https://github.com/Merlin-Liu' }
        ],
        search: false,
        lastUpdated: '最后更新于',
        sidebar: {
            '/blog/': [
                {
                    title: "博客",
                    collapsable: false,
                    children: []
                }
            ],
            '/oldBlog/': [
                {
                    title: "旧博客",
                    collapsable: false,
                    children: [
                        'css',
                        'interview'
                    ]
                }
            ],
        },
        nextLinks: false,
        prevLinks: false
    }
}