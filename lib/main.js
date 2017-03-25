
const h = require('render-html-rpf');
const mapProperties = require('map-properties');

module.exports = async (api) => {
    api.get('/', async ctx => {
        multiExecAsync(client, multi => {
            multi.hincrby(redisK.reqC, 'root', 1);
        });
        ctx.redirect('/analytics');
    });
    api.get('/analytics', async ctx => {
        multiExecAsync(client, multi => {
            multi.hincrby(redisK.reqC, 'analytics', 1);
        });
        const [reqCountRes] = await multiExecAsync(client, multi => {
            multi.hgetall([config.redisNamespace, 'req:count:h'].join(':'));
        });
        const reqCount = mapProperties(reqCountRes || {}, value => parseInt(value));
        const analytics = {reqCount};
        if (/(Mobile)/.test(ctx.get('user-agent'))) {
            ctx.body = h.page({
                title: 'relytic',
                heading: 'Analytics',
                content: [{
                    name: 'pre',
                    content: JSON.stringify(analytics, null, 2)}
                ],
                footerLink: 'https://github.com/evanx/relytic'
            });
        } else {
            ctx.body = analytics;
        }
    });
    return true;
}
