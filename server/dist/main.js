"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const hoodwinkModule_1 = require("./hoodwinkModule");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(hoodwinkModule_1.HoodwinkModule);
    app.use((0, helmet_1.default)());
    await app.listen(process.env.PORT ?? 2409);
}
bootstrap();
//# sourceMappingURL=main.js.map