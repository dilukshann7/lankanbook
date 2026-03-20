CREATE TABLE "establishments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "establishments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"province" varchar(100) NOT NULL,
	"description" text,
	"proofUrl" text,
	"upvotes" integer DEFAULT 0,
	"verified" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"establishmentId" integer,
	"testimony" text NOT NULL,
	"proofUrl" text,
	"reporterName" varchar(255),
	"upvotes" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_establishmentId_establishments_id_fk" FOREIGN KEY ("establishmentId") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;