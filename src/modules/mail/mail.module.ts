import { ContainerModule } from 'inversify';
import { MailService } from './mail.service';

const MailModule = new ContainerModule(({ bind }) => {
  bind(MailService).toSelf().inSingletonScope();
});

export default MailModule;
