module.exports = {
    title: 'Niko\'s blog',
    description: '自我驱动～',
    head: [
        ['link', { rel: 'icon', href: '/icon.png' }]
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
                    children: [
                        'react-scheduler',
                        'browser',
                        'code',
                        'js'
                    ]
                }
            ],
            '/oldBlog/': [
                'BSTmap',
                'BST',
                'functional',
                'httpCache',
                'vuediff',
                {
                    title: "数据库事务处理的并发控制技术",
                    collapsable: true,
                    children: [
                        'concurrent',
                        'transactionModel'
                    ]
                },
                {
                    title: "基础业务",
                    collapsable: true,
                    children: [
                        'imageLazy',
                        'sticky'
                    ]
                },
                'setState',
                'virtualDOM',
                'css',
                'interview',
                {
                    title: "前端实习生面试题分析",
                    collapsable: true,
                    children: [
                        'answer1',
                        'answer2'
                    ]
                },
                {
                    title: "Redux和React-Redux的实现",
                    collapsable: true,
                    children: [
                        'react-redux1',
                        'react-redux2',
                        'react-redux3'
                    ]
                }
            ],
        },
        nextLinks: false,
        prevLinks: false
    }
}