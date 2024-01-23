import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customise';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Cron } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron("0 0 0 * * 0")
  async handleTestEmail() {
    const subscribes = await this.subscriberModel.find({});

    for (const subscribe of subscribes) {
      const subscribeSkills = subscribe.skills;
      const jobsWithMatchingSkills = await this.jobModel.find({ skills: { $in: subscribeSkills } });

      if (jobsWithMatchingSkills.length > 0) {
        const jobs = jobsWithMatchingSkills.map(job => {
          return {
            name: job.name,
            company: job.company._id,
            salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: job.skills
          }
        })

        await this.mailerService.sendMail({
          to: subscribe.email,
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'job',
          context: {
            receiver: subscribe.name,
            jobs: jobs
          }
        });
      }
    }
  }
}
