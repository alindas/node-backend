require("../utils/registerPath");

const db = require("@/core/database");
const { generateModelsByTable } = require("@/core/database/generator");
const { sqlLogger: logger } = require("@/core/log");

/**
 * 审计字段就是数据库表里的一些特殊列，用来记录数据的变化历史。
 * 比如谁在什么时候创建了这条数据，谁修改过，什么时候修改的，甚至删除的时候有没有记录。
 * 这些都是为了追踪数据的变动情况。
 *
 * 这些字段是脱离业务逻辑的，仅仅是用于系统内部的日后追踪。
 * WHY?
 * 1.​查问题方便
 * 2.防止背黑锅
 * 3.防止误操作
 */

/**
 * 添加审计字段到表
 * @param {string} tableName 表名
 * @param {string} flag 审计字段类型：'time'|'by'|'all'
 */
async function addAuditFields(tableName, flag = "") {
  try {
    // Wait for database initialization
    await db.init();
    const queryInterface = db.client.sequelize.getQueryInterface();
    const fields = [];

    if (flag === "time" || flag === "all") {
      fields.push(
        {
          name: "createTime",
          type: "DATETIME",
          allowNull: true,
          defaultValue: db.client.sequelize.literal("CURRENT_TIMESTAMP"),
          comment: "创建时间",
        },
        {
          name: "updateTime",
          type: "DATETIME",
          allowNull: true,
          defaultValue: db.client.sequelize.literal("CURRENT_TIMESTAMP"),
          onUpdate: db.client.sequelize.literal("CURRENT_TIMESTAMP"),
          comment: "更新时间",
        },
      );
    }

    if (flag === "by" || flag === "all") {
      fields.push(
        {
          name: "createBy",
          type: "VARCHAR(64)",
          allowNull: true,
          comment: "创建者",
        },
        {
          name: "updateBy",
          type: "VARCHAR(64)",
          allowNull: true,
          comment: "更新者",
        },
      );
    }

    // 如果有字段需要添加
    if (fields.length > 0) {
      for (const field of fields) {
        console.log("🍁===>【  field】", field);
        try {
          await queryInterface.addColumn(tableName, field.name, {
            type: field.type,
            allowNull: field.allowNull,
            defaultValue: field.defaultValue,
            onUpdate: field.onUpdate,
            comment: field.comment,
          });
          logger.info(`Successfully added ${field.name} to ${tableName}`);
        } catch (error) {
          // 如果字段已存在，继续处理下一个字段
          if (error.name === "SequelizeDatabaseError") {
            logger.warn(`Column ${field.name} already exists in ${tableName}`);
            continue;
          }
          throw error;
        }
      }
    }

    // 重新生成模型
    await generateModelsByTable(db.client.sequelize, tableName);
    logger.info(`Successfully processed audit fields for table: ${tableName}`);
  } catch (error) {
    logger.error(`Error adding audit fields to ${tableName}: ${error.message}`);
    throw error;
  }
}

// 根据具体表名和审计字段类型调用函数
// addAuditFields("users", "time");
