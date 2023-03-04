import Database from '@ioc:Adonis/Lucid/Database'

export class AccountService {
  public static async list({ request }) {
    const { page = 1, pageSize = 10, filter = {}, sortedBy, sortedDesc } = request.qs()

    const DEVICES_COUNT =
      '(SELECT COUNT(*) FROM devices WHERE account_id = a.id AND deleted_at IS NULL)'

    const query = Database.query()
      .from('accounts as a')
      .whereNull('a.deleted_at')
      .join('users as u', 'u.account_id', '=', 'a.id')
      .leftJoin('organizations as o', 'o.account_id', '=', 'a.id')
      .select('a.*')
      .select('u.name as userName', 'u.email as userEmail', 'u.phone as userPhone')
      .select('o.name as orgName', 'o.inn as orgInn', 'o.fio as orgFio')
      .select(Database.raw(`${DEVICES_COUNT} as "devicesCount"`))

    const { id, name, email, phone, inn, company, fio, devicesCount } = filter

    if (id) {
      query.andWhere('a.id', id)
    }
    if (email) {
      query.andWhere('u.email', 'like', `%${email}%`)
    }
    if (name) {
      query.andWhere('u.name', 'like', `%${name}%`)
    }
    if (phone) {
      query.andWhere('u.phone', 'like', `%${phone}%`)
    }
    if (inn) {
      query.andWhere('o.inn', 'like', `%${inn}%`)
    }
    if (company) {
      query.andWhere('o.name', 'like', `%${company}%`)
    }
    if (fio) {
      query.andWhere('o.fio', 'like', `%${fio}%`)
    }
    if (Number.isInteger(+devicesCount)) {
      query.andWhere(Database.raw(DEVICES_COUNT), devicesCount)
    }

    const result = await query
      .orderBy(sortedBy ?? 'created_at', sortedDesc === 'true' ? 'desc' : 'asc')
      .paginate(page, pageSize)

    return {
      result: {
        page: +result.currentPage,
        pageSize: +result.perPage,
        rows: result.all(),
        count: +result.total,
      },
    }
  }
}
