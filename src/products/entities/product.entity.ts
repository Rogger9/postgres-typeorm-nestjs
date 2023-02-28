import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { normalizeSlug } from '../utils/normalizeSlug'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { unique: true })
  title: string

  @Column('float', { default: 0 })
  price: number

  @Column({ type: 'text', nullable: true })
  desc: string

  @Column({ type: 'text', unique: true })
  slug: string

  @Column({ type: 'int', default: 0 })
  stock: number

  @Column({ type: 'text', array: true })
  sizes: string[]

  @Column('text')
  gender: string

  @Column('text', { array: true, default: [] })
  tags: string[]

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
    }

    this.slug = normalizeSlug(this.slug)
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = normalizeSlug(this.slug)
  }
}
