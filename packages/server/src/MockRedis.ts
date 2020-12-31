export default class MockRedis {
  private data = new Map<string, string>()

  public get(key: string) {
    return this.data.get(key) ?? null
  }

  public setex(key: string, _exp: number, value: string) {
    this.data.set(key, value)
  }
}
