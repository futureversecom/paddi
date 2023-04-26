export class HealthCheckService {
  constructor(private env: 'dev' | 'staging' | 'prod') {}

  public async check(): Promise<string> {
    return `Success from: ${this.env}`
  }
}
