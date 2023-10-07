using receiptParserServices.domain;
using receiptParserServices.repository.model;
using shortid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.repository.mappers
{
    internal static class ReceiptMapper
    {
        public static ReceiptDto MapReceiptToReceiptDto(Receipt receipt)
        {

            ReceiptDto receiptDto = new ReceiptDto();
            receiptDto.receiptId = receipt.receiptId;
            receiptDto._id = receipt.Id;
            receiptDto.total = receipt.total;
            receiptDto.tip = receipt.tip;

            receipt.items.ForEach(x =>
            {
                ItemDto itemDto = new ItemDto();
                itemDto.price = x.price;
                itemDto.quantity = x.quantity;
                itemDto.description = x.description;
                itemDto.itemId = x.itemId;
                x.claims.ForEach(c =>
                {
                    ClaimDto claimDto = new ClaimDto();
                    claimDto.quantity = c.quantity;
                    claimDto.userId = c.userId;
                    claimDto.total = c.total;
                    itemDto.claims.Add(claimDto);
                });
                receiptDto.items.Add(itemDto);
            });
            receiptDto.merchantName = receipt.merchantName;
            receipt.users.ForEach(x =>
            {
                UserDto userDto = new UserDto();
                userDto.userId = x.userId;
                userDto.name = x.name;
                receiptDto.users.Add(userDto);
            });

            return receiptDto;
        }

        public static Receipt MapReceiptDtoToReceipt(ReceiptDto receiptDto)
        {
            Receipt receipt = new Receipt();
            receipt.tip = receiptDto.tip;
            receipt.total = receiptDto.total;
            receipt.receiptId = receiptDto.receiptId;
            receipt.Id = receiptDto._id;
            receiptDto.users.ForEach(x =>
            {
                User user = new User();
                user.userId = x.userId;
                user.name = x.name;
                receipt.users.Add(user);
            });

            receiptDto.items.ForEach(x =>
            {
                Item item = new Item();
                item.description = x.description;
                item.price = x.price;
                item.quantity = x.quantity;
                item.itemId = x.itemId;
                x.claims.ForEach(c =>
                {
                    Claim claim = new Claim();
                    claim.total = c.total;
                    claim.quantity = c.quantity;
                    claim.userId = c.userId;
                    item.claims.Add(claim);
                });
                receipt.items.Add(item);
            });

            return receipt;

        }

        public static List<Item> MapItemDtosToItems(List<ItemDto> itemsDtos)
        {
            List<Item> items = new List<Item>();
            itemsDtos.ForEach(x =>
            {
                Item item = new Item();
                item.description = x.description;
                item.price = x.price;
                item.quantity = x.quantity;
                item.itemId = x.itemId;
                x.claims.ForEach(c =>
                {
                    Claim claim = new Claim();
                    claim.total = c.total;
                    claim.quantity = c.quantity;
                    claim.userId = c.userId;
                    item.claims.Add(claim);
                });
                items.Add(item);
            });
            return items;
        }

        public static List<ItemDto> MapItemsToItemDtos(List<Item> items)
        {
            List<ItemDto> itemDtos = new List<ItemDto>();
            items.ForEach(x =>
            {
                ItemDto itemDto = new ItemDto();
                itemDto.price = x.price;
                itemDto.quantity = x.quantity;
                itemDto.description = x.description;
                itemDto.itemId = x.itemId;
                x.claims.ForEach(c =>
                {
                    ClaimDto claimDto = new ClaimDto();
                    claimDto.quantity = c.quantity;
                    claimDto.userId = c.userId;
                    claimDto.total = c.total;
                    itemDto.claims.Add(claimDto);
                });
                itemDtos.Add(itemDto);
            });
            return itemDtos;
        }

        public static List<UserDto> MapUserNamesToUserDtos(List<string> userNames)
        {
            List<UserDto> userDtosList = new List<UserDto>();
            var generateOptions = new shortid.Configuration.GenerationOptions(true, false, 8);

            foreach (var uName in userNames)
            {
                string userId = ShortId.Generate(generateOptions);
                UserDto nUser = new UserDto();
                nUser.userId = userId;
                nUser.name = uName;
                userDtosList.Add(nUser);
            }
            return userDtosList;
        }

        public static List<User> MapUserNamesToUsers(List<string> userNames)
        {
            List<User> users = new List<User>();
            var generateOptions = new shortid.Configuration.GenerationOptions(true, false, 8);

            foreach (var uName in userNames)
            {
                string userId = ShortId.Generate(generateOptions);
                User nUser = new User();
                nUser.userId = userId;
                nUser.name = uName;
                users.Add(nUser);
            }
            return users;
        }
    }
}
